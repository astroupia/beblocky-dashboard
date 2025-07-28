import { Types } from "mongoose";
import { ICreateUserDto, IUpdateUserDto } from "../user";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface IStudent {
  _id?: string; // MongoDB ObjectId as string
  userId: string; // String ID from better-auth
  dateOfBirth?: Date;
  grade?: number;
  gender?: Gender;
  schoolId?: Types.ObjectId;
  parentId?: Types.ObjectId;
  enrolledCourses: Types.ObjectId[];
  coins: number;
  codingStreak: number; // Current coding streak
  lastCodingActivity: Date; // Last coding activity for streak
  totalCoinsEarned: number; // Total coins earned across all courses
  totalTimeSpent: number; // Total learning time in minutes
  goals?: string[];
  subscription?: string;
  section?: string; // Class section (e.g., "A", "B", "1A")
  emergencyContact?: IEmergencyContact;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStudentDto extends ICreateUserDto {
  dateOfBirth?: Date;
  grade?: number;
  gender?: Gender;
  schoolId?: Types.ObjectId;
  parentId?: Types.ObjectId;
  enrolledCourses?: Types.ObjectId[];
  coins?: number;
  codingStreak?: number;
  lastCodingActivity?: Date;
  totalCoinsEarned?: number;
  totalTimeSpent?: number;
  goals?: string[];
  subscription?: string;
  emergencyContact?: IEmergencyContact;
  section?: string;
}

export type IUpdateStudentDto = Partial<ICreateStudentDto> &
  Partial<IUpdateUserDto>;

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

export interface IUpdateTimeSpentDto {
  minutes: number;
}

export interface IUpdateCodingActivityDto {
  // This interface is used for updating coding activity
  // Currently no additional properties are needed
  [key: string]: any;
}

export interface IStudentStats {
  totalCoinsEarned: number;
  codingStreak: number;
  totalTimeSpent: number;
  enrolledCoursesCount: number;
}
