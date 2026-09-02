import { Router } from 'express';
import ChatMessage from '../models/ChatMessage.js';
import FileMeta from '../models/FileMeta.js';
import Stats from '../models/Stats.js';

const router = Router();

function toFileDto(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    type: doc.type,
    size: doc.size,
    date: doc.date,
    tags: doc.tags,
  };
}

router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = (await Stats.findById('global').lean()) || {};
    const recentHistoryDocs = (await ChatMessage.find().sort({ timestamp: -1 }).limit(5).lean()).reverse();
    const recentFilesDocs = (await FileMeta.find().sort({ createdAt: -1 }).limit(5).lean()).reverse();

    res.json({
      stats: {
        total_queries: stats.totalQueries || 0,
        docs_indexed: stats.docsIndexed || 0,
        active_users: stats.activeUsers ?? 1,
        avg_latency_ms: stats.lastLatencyMs ?? 45,
      },
      recent_history: recentHistoryDocs.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
      files: recentFilesDocs.map(toFileDto),
    });
  } catch (e) {
    next(e);
  }
});

export { toFileDto };
export default router;
