import { Types } from "mongoose";

export enum CourseSubscriptionType {
  FREE = "Free",
  STARTER = "Starter",
  BUILDER = "Builder",
  PRO = "Pro-Bundle",
  ORGANIZATION = "Organization",
}

export enum CourseStatus {
  ACTIVE = "Active",
  DRAFT = "Draft",
}

export interface ICourse {
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  slides: Types.ObjectId[];
  lessons: Types.ObjectId[];
  students: Types.ObjectId[];
  subType: CourseSubscriptionType;
  status: CourseStatus;
  rating: number;
  school: Types.ObjectId;
  language: string;
}

export interface ICreateCourseDto {
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType?: CourseSubscriptionType;
  status?: CourseStatus;
  language?: string;
}

export interface ICreateCourseWithContentDto extends ICreateCourseDto {
  slides?: Array<{
    title: string;
    content: string;
    order: number;
  }>;
  lessons?: Array<{
    title: string;
    description: string;
    order: number;
  }>;
}

export interface IUpdateCourseDto extends Partial<ICreateCourseDto> {
  rating?: number;
  students?: Types.ObjectId[];
  slides?: Types.ObjectId[];
  lessons?: Types.ObjectId[];
}
