from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from rag import SimpleRAG
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS configuration
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Simple RAG System
# Ensure GEMINI_API_KEY is set in environment or .env
if not os.getenv("GEMINI_API_KEY"):
    print("WARNING: GEMINI_API_KEY not found. RAG system might fail.")

rag_system = SimpleRAG()

class QueryRequest(BaseModel):
    question: str
    history: list = []

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Clear existing knowledge base to ensure we only chat about the NEW file
        rag_system.clear_database()
        
        # Save file temporarily
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        
        mime_type = file.content_type
        print(f"DEBUG: File uploaded: {file.filename}, Type: {mime_type}")

        # Separate Flow for Media (Image/Video)
        if mime_type.startswith('image/') or mime_type.startswith('video/'):
            rag_system.clear_database()
            rag_system.set_media(file_location, mime_type)
            os.remove(file_location)
            
            # Simple placeholder summary for media
            file_type = "image" if "image" in mime_type else "video"
            return {
                "message": f"Successfully processed {file.filename}",
                "chunks": 0,
                "summary": f"✨ **{file_type.upper()} LOADED!** I can now see this {file_type}. Ask me anything about it! 📸🎥",
                "is_media": True,
                "mime": mime_type
            }

        # Ingest Document (PDF/Text)
        num_chunks = rag_system.ingest_file(file_location)
        
        # Cleanup
        os.remove(file_location)
        
        if num_chunks == 0:
            raise HTTPException(status_code=400, detail="Could not extract text from this file. It might be an image-based PDF. Please upload a multmedia file or a text PDF.")
        
        # Generate Summary
        summary = rag_system.summarize_document()
        
        return {
            "message": f"Successfully processed {file.filename}", 
            "chunks": num_chunks,
            "summary": summary,
            "is_media": False
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_knowledge(request: QueryRequest):
    try:
        answer = rag_system.query(request.question, request.history)
        return {"answer": answer}
    except Exception as e:
        print(f"Error querying: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear")
async def clear_database():
    rag_system.clear_database()
    return {"message": "Database cleared"}
