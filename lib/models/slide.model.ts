import { Schema, model, models } from "mongoose";

const SlideSchema = new Schema(
  {
    _id: { type: String, unique: true, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
    backgroundColor: { type: String, required: false },
    color: { type: String, required: false },
    title: { type: String, required: true },
    titleFont: { type: String, required: false },
    content: { type: String, required: false },
    contentFont: { type: String, required: false },
    startingCode: { type: String, required: false },
    code: { type: String, required: false },
    image: { type: String, required: false },
  },
  { _id: true, timestamps: true } // Enable `_id` and `timestamps` for each slide
);

const Slide = models.Slide || model("Slide", SlideSchema);

export default Slide;
