import { Types } from 'mongoose';
import { UserRole } from '../user';

export interface IStudent {
  userId: Types.ObjectId;
  grade: string;
  coins: number;
  goals: Array<{
    title: string;
    description: string;
    targetDate: Date;
    completed: boolean;
  }>;
  enrolledCourses: Types.ObjectId[];
  parentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStudentDto {
  userId: Types.ObjectId;
  grade: string;
  parentId?: Types.ObjectId;
}

export interface IUpdateStudentDto {
  grade?: string;
  coins?: number;
  goals?: Array<{
    title: string;
    description: string;
    targetDate: Date;
    completed: boolean;
  }>;
  parentId?: Types.ObjectId;
}

export interface IEnrollCourseDto {
  courseId: Types.ObjectId;
}

export interface IAddCoinsDto {
  amount: number;
}

export interface IAddGoalDto {
  title: string;
  description: string;
  targetDate: Date;
}
