import mongoose from 'mongoose';

const fileMetaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  date: { type: String, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('FileMeta', fileMetaSchema);
