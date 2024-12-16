import { Schema, model, models } from "mongoose";

// Course Schema
const CourseSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true }, // Unique identifier for the course
    courseTitle: { type: String, required: true }, // Title of the course
    courseDescription: { type: String, required: true }, // Description of the course
    courseLanguage: { type: String, required: true }, // Language of the course
    slides: [{ type: Schema.Types.ObjectId, ref: "Slide" }], // Array of slides with Id
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }], // Array of lessons
    subType: {
      type: String,
      enum: ["Free", "Standard", "Premium", "Gold"],
      required: true,
      default: "Free",
    }, // Subscribtion type of course (e.g., "Free" or "Standard", "Gold")
    status: {
      type: String,
      enum: ["Active", "Draft"],
      required: true,
      default: "Draft",
    },
  },
  { timestamps: true } // Automatically manage `createdAt` and `updatedAt`
);

const Course = models.Course || model("Course", CourseSchema);

export default Course;
