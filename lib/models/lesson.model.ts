import { Schema, model, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const LessonSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    lessonTitle: { type: String, required: true }, // Add necessary fields for lessons
    lessonDescription: { type: String, required: false },
    slides: [{ type: Schema.Types.ObjectId, ref: "Slide" }], // Example field for lesson resources
  },
  { _id: true, timestamps: true } // Enable `_id` and timestamps for each slide
);

const Lesson = models.Lesson || model("Lesson", LessonSchema);

export default Lesson;
