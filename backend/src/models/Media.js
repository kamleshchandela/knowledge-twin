import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  _id: { type: String, default: 'active' },
  data: { type: String, required: true },
  mimeType: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Media', mediaSchema);
