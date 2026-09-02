import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import Chunk from '../models/Chunk.js';
import Media from '../models/Media.js';
import FileMeta from '../models/FileMeta.js';
import { getEmbedding, buildModelsToTry, generateContent } from './geminiService.js';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;

const FAST_GREETINGS = new Set([
  'hi', 'hello', 'hey', 'yo', 'hola', 'sup', 'hii', 'heyy',
  'good morning', 'good afternoon', 'good evening',
]);

const PROFILE_MODELS = {
  fast: [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-pro-latest',
  ],
  quality: [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-pro-latest',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash-lite',
  ],
  balanced: [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-pro',
    'gemini-pro-latest',
  ],
};

const SUMMARY_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-pro-latest',
];

function chunkText(text) {
  const chunks = [];
  const step = CHUNK_SIZE - CHUNK_OVERLAP;
  for (let i = 0; i < text.length; i += step) {
    const chunk = text.slice(i, i + CHUNK_SIZE);
    if (chunk.length < 10) continue;
    chunks.push(chunk);
  }
  return chunks;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < vecA.length; i += 1) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function extractText(buffer, filename) {
  if (filename.toLowerCase().endsWith('.pdf')) {
    try {
      const parsed = await pdfParse(buffer);
      return parsed.text || '';
    } catch (e) {
      console.error(`pdf-parse failed: ${e.message}`);
      return '';
    }
  }
  return buffer.toString('utf-8');
}

export async function ingestFile(buffer, filename) {
  let text = await extractText(buffer, filename);
  text = text.replace(/\x00/g, '');

  console.log(`Extracted ${text.length} characters from ${filename}`);
  if (!text.trim()) {
    console.warn('WARNING: No text extracted. likely image-based PDF.');
    return 0;
  }

  const chunks = chunkText(text);
  console.log(`Ingesting ${chunks.length} chunks...`);

  const docs = [];
  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    docs.push({ content: chunk, embedding, source: filename });
  }
  if (docs.length) await Chunk.insertMany(docs);

  await FileMeta.create({
    title: filename,
    type: filename.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT',
    size: `${(text.length / 1024).toFixed(1)} KB`,
    date: 'Just now',
    tags: ['Uploaded'],
  });

  return chunks.length;
}

export async function setMedia(buffer, mimeType, filename) {
  const encoded = buffer.toString('base64');
  await Media.findByIdAndUpdate(
    'active',
    { data: encoded, mimeType, updatedAt: new Date() },
    { upsert: true },
  );
  console.log(`DEBUG: Media set. Type: ${mimeType}, Size: ${encoded.length} chars`);

  const mediaType = mimeType.startsWith('image/') ? 'Image' : 'Video';
  await FileMeta.create({
    title: filename,
    type: mediaType,
    size: `${(encoded.length / 1024).toFixed(1)} KB`,
    date: 'Just now',
    tags: ['Media', mediaType],
  });
}

export async function summarizeDocument() {
  const docs = await Chunk.find().limit(10).lean();
  if (!docs.length) return 'No document found. 📄';

  const context = docs.map((d) => d.content).join('\n\n');
  const prompt = `Summarize this document in 3-5 short bullet points. 📑\n**SKIP INTRO.** Just direct highlights with emojis! ✨\n\n${context}`;

  const models = await buildModelsToTry(SUMMARY_MODELS);
  const result = await generateContent({ parts: [{ text: prompt }], models });
  if (typeof result === 'string') return result;
  return `Could not generate summary. All brains busy! 💤 (Details: ${result.message})`;
}

export async function answerQuestion(question, history = [], modelProfile = 'balanced') {
  if (!process.env.GEMINI_API_KEY) {
    return 'GEMINI_API_KEY not found.';
  }

  const questionLower = question.trim().toLowerCase();
  const isFastGreeting = FAST_GREETINGS.has(questionLower);

  const media = await Media.findById('active').lean();
  const docCount = await Chunk.countDocuments();

  let context = '';
  if (docCount > 0 && !isFastGreeting) {
    const qEmbedding = await getEmbedding(question);
    const allChunks = await Chunk.find().lean();
    const scored = allChunks.map((doc) => ({
      score: cosineSimilarity(qEmbedding, doc.embedding),
      content: doc.content,
    }));
    scored.sort((a, b) => b.score - a.score);
    const bestScore = scored.length ? scored[0].score : 0;
    if (bestScore > 0.15) {
      context = scored.slice(0, 3).map((s) => s.content).join('\n\n');
    }
  }

  let historyStr = '';
  if (history.length) {
    const cleanHistory = history.slice(-6);
    for (const msg of cleanHistory) {
      const role = msg.role === 'user' ? 'User' : 'Twin';
      let content = (msg.content || '').slice(0, 500);
      if (msg.type === 'file') content = `[Uploaded File: ${content}]`;
      historyStr += `${role}: ${content}\n`;
    }
  }
  const historyBlock = historyStr ? `\nRecent Conversation History:\n${historyStr}\n` : '';

  let prompt;
  if (isFastGreeting) {
    prompt = `Reply to this greeting naturally in one short sentence: ${question}`;
  } else if (context) {
    prompt =
      'You are a world-class knowledge expert.\n' +
      'Answer using the supplied context with clear and precise detail.\n\n' +
      `Context:\n${context}\n` +
      `${historyBlock}` +
      `Current Question: ${question}\n`;
  } else {
    prompt =
      'You are a world-class knowledge expert.\n' +
      'Provide a concise and useful answer.\n' +
      `${historyBlock}` +
      `Current Question: ${question}\n`;
  }

  const parts = [{ text: prompt }];
  if (media) {
    parts.unshift({ inline_data: { mime_type: media.mimeType, data: media.data } });
  }

  const generationConfig = {
    temperature: isFastGreeting ? 0.4 : 0.7,
    maxOutputTokens: isFastGreeting ? 64 : 512,
  };

  const models = await buildModelsToTry(PROFILE_MODELS[modelProfile] || PROFILE_MODELS.balanced);
  const result = await generateContent({ parts, generationConfig, models, isFastPath: isFastGreeting });
  if (typeof result === 'string') return result;
  return result.message;
}

export async function clearDatabase() {
  await Chunk.deleteMany({});
  await Media.deleteMany({});
}
