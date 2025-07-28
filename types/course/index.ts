import { Types } from "mongoose";

export enum CourseSubscriptionType {
  FREE = "free",
  STARTER = "starter",
  BUILDER = "builder",
  PRO = "pro-bundle",
  ORGANIZATION = "organization",
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
  organization: Types.ObjectId[];
  subType: CourseSubscriptionType;
  status: CourseStatus;
  rating: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseDto {
  courseTitle: string;
  courseDescription?: string;
  courseLanguage: string;
  lessonIds?: Types.ObjectId[];
  slideIds?: Types.ObjectId[];
  organization?: Types.ObjectId[];
  subType?: CourseSubscriptionType;
  status?: CourseStatus;
  rating?: number;
  language?: string;
}

export type IUpdateCourseDto = Partial<ICreateCourseDto>;

export interface ICreateCourseWithContentDto {
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  lessons?: any[]; // Simplified to avoid import conflicts
  slides?: any[]; // Simplified to avoid import conflicts
  subType?: CourseSubscriptionType;
  status?: CourseStatus;
  rating?: number;
  language?: string;
}

// Course Rating Types
// Rating values are now simple numbers (1-5) instead of enum

export interface ICourseRating {
  courseId: Types.ObjectId;
  userId: string; // String ID from better-auth
  rating: number; // Use number instead of RatingValue enum
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseRatingDto {
  rating: number; // Use number instead of RatingValue enum
  review?: string;
}

export type IUpdateCourseRatingDto = Partial<ICreateCourseRatingDto>;

export interface ICourseRatingResponse {
  id: string;
  courseId: string;
  userId: string;
  rating: number; // Use number instead of RatingValue enum
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseRatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    [key: number]: number;
  };
  userRating?: number; // Use number instead of RatingValue enum
  userReview?: string;
}
