import User from "./user.model";
import { Schema } from "mongoose";

const AdminSchema = new Schema({
  accessLevel: {
    type: String,
    enum: ["superadmin", "moderator"],
    default: "moderator",
  }, // Example: Access levels for admin
  managedSchools: [{ type: Schema.Types.ObjectId, ref: "School" }], // Example: List of schools managed by the admin
});

const Admin = User.discriminator("Admin", AdminSchema);

export default Admin;
