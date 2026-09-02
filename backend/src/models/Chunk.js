import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
  content: { type: String, required: true },
  embedding: { type: [Number], required: true },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Chunk', chunkSchema);
