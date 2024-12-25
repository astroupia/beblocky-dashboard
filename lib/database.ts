import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "beblocky-admin",
      bufferCommands: false,
    });
  cached.conn = await cached.promise;
  if (mongoose.connection.db) {
    console.log(
      `Connected to database: ${mongoose.connection.db.databaseName}`
    );
  } else {
    console.log("Database connection failed");
  }
  console.log("Mongoose Connection State:", mongoose.connection.readyState);
  console.log("Available Models:", mongoose.models);
  return cached.conn;
};
