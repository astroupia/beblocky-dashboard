// models/Teacher.js
import User from "./user.model";
import { Schema } from "mongoose";

const TeacherSchema = new Schema({
  expertise: { type: [String], default: [] }, // Areas of expertise
  yearsOfExperience: { type: Number, default: 0 }, // Years teaching
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // Courses managed
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }], // Assigned students
});

const Teacher = User.discriminator("Teacher", TeacherSchema);

export default Teacher;
