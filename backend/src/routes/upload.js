import { Router } from 'express';
import multer from 'multer';
import Stats from '../models/Stats.js';
import { ingestFile, setMedia, summarizeDocument, clearDatabase } from '../services/ragService.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(422).json({ detail: 'No file uploaded.' });
    }

    // Clear existing knowledge base so we only chat about the NEW file.
    await clearDatabase();

    const mimeType = file.mimetype;
    console.log(`DEBUG: File uploaded: ${file.originalname}, Type: ${mimeType}`);

    if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
      await setMedia(file.buffer, mimeType, file.originalname);
      await Stats.findByIdAndUpdate('global', { $inc: { docsIndexed: 1 } }, { upsert: true });

      const fileType = mimeType.includes('image') ? 'image' : 'video';
      return res.json({
        message: `Successfully processed ${file.originalname}`,
        chunks: 0,
        summary: `✨ **${fileType.toUpperCase()} LOADED!** I can now see this ${fileType}. Ask me anything about it! 📸🎥`,
        is_media: true,
        mime: mimeType,
      });
    }

    const numChunks = await ingestFile(file.buffer, file.originalname);

    if (numChunks === 0) {
      return res.status(400).json({
        detail: 'Could not extract text from this file. It might be an image-based PDF. Please upload a multmedia file or a text PDF.',
      });
    }

    await Stats.findByIdAndUpdate('global', { $inc: { docsIndexed: 1 } }, { upsert: true });
    const summary = await summarizeDocument();

    return res.json({
      message: `Successfully processed ${file.originalname}`,
      chunks: numChunks,
      summary,
      is_media: false,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
