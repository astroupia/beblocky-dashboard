import { Types } from 'mongoose';

export interface ITeacher {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  rating: number;
  courses: Types.ObjectId[];
  availability: {
    [key: string]: {
      start: string;
      end: string;
    }[];
  };
  specialties: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeacherDto {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  specialties: string[];
  bio?: string;
}

export interface IUpdateTeacherDto {
  organizationId?: Types.ObjectId;
  rating?: number;
  specialties?: string[];
  bio?: string;
}

export interface IUpdateAvailabilityDto {
  day: string;
  slots: Array<{
    start: string;
    end: string;
  }>;
}

export interface IAddCourseDto {
  courseId: Types.ObjectId;
}

export interface IUpdateRatingDto {
  rating: number;
}
