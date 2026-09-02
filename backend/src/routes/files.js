import { Router } from 'express';
import FileMeta from '../models/FileMeta.js';
import { toFileDto } from './dashboard.js';

const router = Router();

router.get('/files', async (req, res, next) => {
  try {
    const docs = await FileMeta.find().sort({ createdAt: 1 }).lean();
    res.json(docs.map(toFileDto));
  } catch (e) {
    next(e);
  }
});

export default router;
