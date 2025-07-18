import mongoose from "mongoose";

// Global connection cache
let cachedConnection = null;

export const connectDB = async () => {
  // Return cached connection if it exists
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://abdullahwebdev9176:Ma077917600@cluster0.puwen.mongodb.net/blog-app";
    
    // Connection options for better reliability
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(mongoUri, options);
    cachedConnection = conn;
    console.log(`MongoDB Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    cachedConnection = null;
    throw error;
  }
}