import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartspend";
  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true
  });
  console.log("MongoDB connected");
};
