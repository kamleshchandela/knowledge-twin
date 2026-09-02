import { Router } from 'express';
import ChatMessage from '../models/ChatMessage.js';
import Stats from '../models/Stats.js';
import { answerQuestion } from '../services/ragService.js';

const router = Router();

router.post('/query', async (req, res, next) => {
  try {
    const { question, history = [], model_profile: modelProfile = 'balanced' } = req.body;
    if (!question) {
      return res.status(422).json({ detail: 'question is required.' });
    }

    const startTime = process.hrtime.bigint();

    await ChatMessage.create({ role: 'user', content: question });
    await Stats.findByIdAndUpdate('global', { $inc: { totalQueries: 1 } }, { upsert: true });

    const answer = await answerQuestion(question, history, modelProfile);

    await ChatMessage.create({ role: 'model', content: answer });
    const latencyMs = Number((process.hrtime.bigint() - startTime) / 1_000_000n);
    await Stats.findByIdAndUpdate('global', { lastLatencyMs: latencyMs }, { upsert: true });

    return res.json({ answer, latency_ms: latencyMs });
  } catch (e) {
    console.error(`Error querying: ${e.message}`);
    next(e);
  }
});

export default router;
