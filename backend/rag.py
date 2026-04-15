import os
import math
import json
import requests
import time
from typing import List, Dict, Any
from pypdf import PdfReader

# Simple Document Class
class Document:
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}

class SimpleRAG:
    def __init__(self):
        self.documents: List[Document] = []
        self.embeddings: List[List[float]] = []
        self.current_media = None
        self.media_mime = None
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY is not set.")
        else:
            print(f"DEBUG: Loaded API Key ending in ...{self.api_key[-5:]}")

        # Persistence (In-Memory)
        self.chat_history = [] 
        self.files_metadata = [] 
        self.stats = {
            "total_queries": 0,
            "docs_indexed": 0,
            "active_users": 1, 
            "avg_latency_ms": 45 
        }
        self._cached_models: List[str] = []
        self._model_cache_ts = 0.0
        self._model_cache_ttl_seconds = 600

    def _discover_generate_models(self) -> List[str]:
        """Discover text-generation models available to the current API key."""
        if not self.api_key:
            return []
        if self._cached_models and (time.time() - self._model_cache_ts) < self._model_cache_ttl_seconds:
            return self._cached_models

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={self.api_key}"
            response = requests.get(url, timeout=20)
            response.raise_for_status()
            models = response.json().get("models", [])

            discovered = []
            for model in models:
                methods = model.get("supportedGenerationMethods", [])
                name = model.get("name", "")
                if "generateContent" in methods and name.startswith("models/"):
                    discovered.append(name.split("/", 1)[1])

            # Prefer stable general-purpose Gemini models over previews/specialized models.
            blocked_keywords = (
                "preview",
                "tts",
                "image",
                "robotics",
                "computer-use",
                "deep-research",
                "lyria",
                "nano-banana",
                "gemma",
            )
            stable = [m for m in discovered if not any(k in m for k in blocked_keywords)]
            self._cached_models = stable if stable else discovered
            self._model_cache_ts = time.time()
            return self._cached_models
        except Exception as e:
            print(f"WARNING: Could not discover models: {e}")
            return self._cached_models

    def _models_to_try(self, preferred: List[str]) -> List[str]:
        """Merge preferred models with discovered models for resilient fallback."""
        available = self._discover_generate_models()
        if not available:
            return preferred

        ordered = []
        for model in preferred:
            if model in available and model not in ordered:
                ordered.append(model)
        for model in available:
            if model not in ordered:
                ordered.append(model)
        return ordered

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding with 429 retry logic."""
        if not self.api_key:
            return [0.0] * 768
            
        # Verified working URL for basic embeddings
        url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        data = {
            "model": "models/text-embedding-004",
            "content": {"parts": [{"text": text}]}
        }
        
        for attempt in range(3):
            try:
                response = requests.post(url, headers=headers, json=data)
                if response.status_code == 429:
                    print(f"DEBUG: Embedding limit hit. Waiting 10s (Attempt {attempt+1})...")
                    time.sleep(10)
                    continue
                response.raise_for_status()
                result = response.json()
                return result['embedding']['values']
            except Exception as e:
                print(f"Error getting embedding: {e}")
                time.sleep(2)
        return [0.0] * 768

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(a * a for a in vec2))
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        return dot_product / (magnitude1 * magnitude2)

    def ingest_file(self, file_path: str) -> int:
        """Ingest a file and store its chunks and embeddings."""
        text = ""
        if file_path.lower().endswith('.pdf'):
            try:
                reader = PdfReader(file_path)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            except Exception as e:
                print(f"pypdf failed: {e}")
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()

        # Clean text
        text = text.replace('\x00', '')

        print(f"Extracted {len(text)} characters from {file_path}")
        if not text.strip():
            print("WARNING: No text extracted. likely image-based PDF.")
            # We return 0 chunks, but we should probably handle this better in a real app
            return 0

        # Simple splitting
        chunk_size = 1000
        overlap = 100
        chunks = []
        
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size]
            if len(chunk) < 10: continue 
            chunks.append(chunk)

        print(f"Ingesting {len(chunks)} chunks...")
        
        for i, chunk in enumerate(chunks):
            embedding = self._get_embedding(chunk)
            self.documents.append(Document(page_content=chunk, metadata={"source": file_path}))
            self.embeddings.append(embedding)
            
        # Update Stats & Files
        import os, datetime
        self.stats["docs_indexed"] += 1
        file_name = os.path.basename(file_path).replace("temp_", "")
        self.files_metadata.append({
            "id": len(self.files_metadata) + 1,
            "title": file_name,
            "type": "PDF" if file_path.endswith(".pdf") else "TXT",
            "size": f"{len(text)/1024:.1f} KB",
            "date": "Just now",
            "tags": ["Uploaded"]
        })

        return len(chunks)

    def set_media(self, file_path: str, mime_type: str):
        """Convert media to base64 for Gemini Vision/Video."""
        import base64
        with open(file_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        self.current_media = encoded
        self.media_mime = mime_type
        print(f"DEBUG: Media set. Type: {mime_type}, Size: {len(encoded)} chars")

        # Update Stats & Files
        import os, datetime
        self.stats["docs_indexed"] += 1
        file_name = os.path.basename(file_path).replace("temp_", "")
        media_type = "Image" if "image" in mime_type else "Video"
        self.files_metadata.append({
            "id": len(self.files_metadata) + 1,
            "title": file_name,
            "type": media_type,
            "size": f"{len(encoded)/1024:.1f} KB",
            "date": "Just now",
            "tags": ["Media", media_type]
        })
    def query(self, question: str, history: list = []) -> str:
        """Retrieve relevant docs and answer question with low-latency failover."""
        if not self.api_key:
            return "GEMINI_API_KEY not found."

        models_to_try = self._models_to_try([
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-2.0-flash-lite",
            "gemini-2.0-flash",
            "gemini-2.5-pro",
            "gemini-pro-latest",
        ])
        headers = {"Content-Type": "application/json"}
        question_lower = question.strip().lower()
        fast_greetings = {
            "hi", "hello", "hey", "yo", "hola", "sup", "hii", "heyy",
            "good morning", "good afternoon", "good evening",
        }
        is_fast_greeting = question_lower in fast_greetings

        context = ""
        if self.documents and not is_fast_greeting:
            q_embedding = self._get_embedding(question)
            scores = []
            for i, doc_embedding in enumerate(self.embeddings):
                score = self._cosine_similarity(q_embedding, doc_embedding)
                scores.append((score, i))
            scores.sort(key=lambda x: x[0], reverse=True)
            best_score = scores[0][0] if scores else 0
            if best_score > 0.15:
                top_k_indices = [idx for _, idx in scores[:3]]
                context = "\n\n".join([self.documents[idx].page_content for idx in top_k_indices])

        history_str = ""
        if history:
            clean_history = history[-6:]
            for msg in clean_history:
                role = "User" if msg.get("role") == "user" else "Twin"
                content = msg.get("content", "")[:500]
                if msg.get("type") == "file":
                    content = f"[Uploaded File: {content}]"
                history_str += f"{role}: {content}\n"

        history_block = f"\nRecent Conversation History:\n{history_str}\n" if history_str else ""

        if is_fast_greeting:
            prompt = f"Reply to this greeting naturally in one short sentence: {question}"
        elif context:
            prompt = (
                "You are a world-class knowledge expert.\n"
                "Answer using the supplied context with clear and precise detail.\n\n"
                f"Context:\n{context}\n"
                f"{history_block}"
                f"Current Question: {question}\n"
            )
        else:
            prompt = (
                "You are a world-class knowledge expert.\n"
                "Provide a concise and useful answer.\n"
                f"{history_block}"
                f"Current Question: {question}\n"
            )

        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.4 if is_fast_greeting else 0.7,
                "maxOutputTokens": 64 if is_fast_greeting else 512,
            },
        }

        if self.current_media and self.media_mime:
            data["contents"][0]["parts"].insert(0, {
                "inline_data": {
                    "mime_type": self.media_mime,
                    "data": self.current_media
                }
            })

        last_error = ""
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"
            print(f"DEBUG: Trying {model_name}...")
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=data,
                    timeout=12 if is_fast_greeting else 20,
                )

                if response.status_code == 429:
                    print(f"WARNING: 429 Rate Limit for {model_name}. Trying next model...")
                    last_error = f"Limit reached on {model_name} (429)."
                    continue
                if response.status_code == 404:
                    print(f"DEBUG: Model {model_name} not available (404). Skipping...")
                    last_error = f"Model unavailable: {model_name} (404)."
                    continue
                if response.status_code == 403:
                    last_error = "API Key forbidden (403)."
                    continue
                if response.status_code != 200:
                    last_error = f"API Status {response.status_code}: {response.text[:100]}"
                    continue

                result = response.json()
                candidates = result.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
                last_error = f"No text candidates returned by {model_name}."
            except Exception as e:
                print(f"CRITICAL: System error on {model_name}: {e}")
                last_error = "Server connectivity issue."

        return f"Error: model response unavailable right now. Details: {last_error}"
    def update_history(self, role: str, content: str):
        import datetime
        timestamp = datetime.datetime.now().isoformat()
        self.chat_history.append({"role": role, "content": content, "timestamp": timestamp})
        
    def get_dashboard_data(self):
        return {
            "stats": self.stats,
            "recent_history": self.chat_history[-5:],
            "files": self.files_metadata[-5:]
        }

    def summarize_document(self) -> str:
        """Simple and direct summary."""
        if not self.documents:
            return "No document found. 📄"
            
        context = "\n\n".join([doc.page_content for doc in self.documents[:10]])
        
        prompt = f"""Summarize this document in 3-5 short bullet points. 📑
**SKIP INTRO.** Just direct highlights with emojis! ✨

{context}"""

        models_to_try = self._models_to_try([
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-2.0-flash-lite",
            "gemini-pro-latest",
        ])
        
        headers = {"Content-Type": "application/json"}
        last_error = ""

        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"
            print(f"DEBUG: Generating summary with model {model_name}...")
            
            try:
                response = requests.post(url, headers=headers, json=data)
                
                if response.status_code == 429:
                    print(f"WARNING: Rate limit (429) hit. Waiting 10s...")
                    import time
                    time.sleep(10)
                    continue

                response.raise_for_status()
                result = response.json()
                return result['candidates'][0]['content']['parts'][0]['text']
            except Exception as e:
                error_body = response.text if 'response' in locals() and hasattr(response, 'text') else str(e)
                print(f"WARNING: Summary failed on {model_name}: {e}")
                last_error = f"{e} - {error_body[:100]}"
        
        return f"Could not generate summary. All brains busy! 💤 (Details: {last_error})"

    def clear_database(self):
        self.documents = []
        self.embeddings = []
        self.current_media = None
        self.media_mime = None


