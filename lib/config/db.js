import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://abdullahwebdev9176:Ma077917600@cluster0.puwen.mongodb.net/blog-app";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit process in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
}