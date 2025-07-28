import { Types } from "mongoose";

export enum LessonDifficulty {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export interface ILesson {
  _id?: string; // MongoDB ObjectId as string
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  slides: Types.ObjectId[];
  difficulty: LessonDifficulty;
  duration: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLessonDto {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  slides?: Types.ObjectId[];
  difficulty?: LessonDifficulty;
  duration: number;
  tags?: string[];
}

export type IUpdateLessonDto = Partial<ICreateLessonDto>;

export interface IAddSlideDto {
  slideId: Types.ObjectId;
}

export interface IReorderLessonsDto {
  lessonIds: Types.ObjectId[];
}
