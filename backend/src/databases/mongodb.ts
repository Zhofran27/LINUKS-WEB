import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};