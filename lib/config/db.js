import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://abdullahwebdev9176:Ma077917600@cluster0.puwen.mongodb.net/blog-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected sucessfully`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}