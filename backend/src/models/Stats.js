import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  _id: { type: String, default: 'global' },
  totalQueries: { type: Number, default: 0 },
  docsIndexed: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 1 },
  lastLatencyMs: { type: Number, default: 45 },
});

export default mongoose.model('Stats', statsSchema);
