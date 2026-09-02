import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import uploadRoute from './routes/upload.js';
import queryRoute from './routes/query.js';
import dashboardRoute from './routes/dashboard.js';
import filesRoute from './routes/files.js';
import clearRoute from './routes/clear.js';

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY not found. RAG system might fail.');
}

app.use(uploadRoute);
app.use(queryRoute);
app.use(dashboardRoute);
app.use(filesRoute);
app.use(clearRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Knowledge Twin backend listening on http://localhost:${PORT}`);
  });
}

start();
