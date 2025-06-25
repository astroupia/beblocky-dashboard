import { Types } from "mongoose";

export enum LessonDifficulty {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export interface ILesson {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  courseId: Types.ObjectId;
  slides: Types.ObjectId[];
  difficulty: LessonDifficulty;
  duration: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLessonDto {
  title: string;
  description: string;
  courseId: Types.ObjectId;
  difficulty: LessonDifficulty;
  duration: number;
  tags?: string[];
  slides?: Types.ObjectId[];
}

export interface IUpdateLessonDto {
  title?: string;
  description?: string;
  difficulty?: LessonDifficulty;
  duration?: number;
  tags?: string[];
  slides?: Types.ObjectId[];
}

export interface IAddSlideDto {
  slideId: Types.ObjectId;
}

export interface IReorderLessonsDto {
  lessonIds: Types.ObjectId[];
}
