import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

async function connectDB(): Promise<void> {
  const mongoURI: string | undefined = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MongoDB URI not provided in environment variables');
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export default connectDB;
