"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import { CreateUserParams, UpdateUserParams } from "@/types/user";
import User from "@/lib/models/user.model"; // Import the User model

// Creates a new user in the database
export async function createUser(userData: CreateUserParams) {
  await connectToDatabase();
  return await User.create(userData);
}

export async function getAllUsers() {
  await connectToDatabase();
  const users = await User.find({});
  return users;
}

// Retrieves a user by their Clerk ID
export async function getUserById(userId: string) {
  await connectToDatabase();
  return await User.findOne({ clerkId: userId }).lean();
}

// Updates a user's information
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  await connectToDatabase();
  const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
    new: true,
  });
  if (!updatedUser) throw new Error("User update failed");
  return JSON.parse(JSON.stringify(updatedUser));
}

// Retrieves a user's role, defaulting to "customer" if not found
export async function getUserRole(userId: string): Promise<string> {
  await connectToDatabase();
  const user = await User.findOne({ clerkId: userId });
  return user?.role || "teacher";
}

// Deletes a user from the database
export async function deleteUser(clerkId: string) {
  await connectToDatabase();
  const userToDelete = await User.findOne({ clerkId });
  if (!userToDelete) throw new Error("User not found");
  const deletedUser = await User.findByIdAndDelete(userToDelete._id);
  revalidatePath("/");
  return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
}

// Retrieves a user by their email address
export async function getUserByEmail(email: string | undefined) {
  if (!email) return null;
  await connectToDatabase();
  const user = await User.findOne({ email: email.toLowerCase() });
  return user ? user.toObject() : null;
}
