import { Router } from 'express';
import { clearDatabase } from '../services/ragService.js';

const router = Router();

router.delete('/clear', async (req, res, next) => {
  try {
    await clearDatabase();
    res.json({ message: 'Database cleared' });
  } catch (e) {
    next(e);
  }
});

export default router;
