import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  await mongoose.connect(env.MONGO_URI);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected successfully.");
};

export default connectDB;
