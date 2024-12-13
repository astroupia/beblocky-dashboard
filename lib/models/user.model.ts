import { Schema, model, models } from "mongoose";

console.log("Defining User model...");

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    role: {
      type: String,
      enum: ["teacher", "admin"],
      required: true,
      default: "teacher",
    },
  },
  { discriminatorKey: "role", timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
