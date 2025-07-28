import { Types } from "mongoose";

export interface IProgress {
  userId: string; // String ID from better-auth
  courseId: Types.ObjectId;
  lessonId: Types.ObjectId;
  slideId: Types.ObjectId;
  isCompleted: boolean;
  timeSpent: number; // in minutes
  codeAttempts: number;
  lastAttemptAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProgressDto {
  courseId: string;
  lessonId: string;
  slideId: string;
  isCompleted?: boolean;
  timeSpent?: number;
  codeAttempts?: number;
}

export interface IUpdateProgressDto {
  isCompleted?: boolean;
  timeSpent?: number;
  codeAttempts?: number;
}

export interface ICompleteLessonDto {
  lessonId: string;
  timeSpent: number;
}

export interface ISaveCodeDto {
  courseId: string;
  lessonId: string;
  slideId: string;
  code: string;
  language: string;
}

export interface IProgressResponse {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  slideId: string;
  isCompleted: boolean;
  timeSpent: number;
  codeAttempts: number;
  lastAttemptAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
