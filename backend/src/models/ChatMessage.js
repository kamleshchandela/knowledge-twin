import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('ChatMessage', chatMessageSchema);
