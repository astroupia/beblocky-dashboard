import mongoose from "mongoose";

let isConnected: boolean = false;

// Connects to the MongoDB database
export const connectToDatabase = async () => {
  if (isConnected) return;

  const dbUrl = process.env.MONGODB_URL;
  const dbName = "beblocky-admin";

  if (!dbUrl)
    throw new Error("MongoDB URL is not defined in environment variables");

  try {
    const db = await mongoose.connect(dbUrl, { dbName });
    isConnected = true;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

export class ObjectId {
  constructor(id?: string) {
    return new mongoose.Types.ObjectId(id);
  }
}

export function serializeObjectId(id: mongoose.Types.ObjectId): string {
  return id.toString();
}
