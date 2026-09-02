import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('WARNING: MONGODB_URI not set. Database features will fail.');
    return;
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
