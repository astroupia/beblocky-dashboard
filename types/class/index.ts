import { Types } from "mongoose";

// Enums
export enum ClassUserType {
  TEACHER = "teacher",
  ADMIN = "admin",
  PARENT = "parent",
}

// Sub-interfaces
export interface IClassSettings {
  allowStudentEnrollment: boolean;
  requireApproval: boolean;
  autoProgress: boolean;
}

export interface IClassMetadata {
  grade?: string;
  subject?: string;
  level?: string;
}

export interface IClassCreator {
  userId: string; // String ID from better-auth
  userType: ClassUserType;
}

// Main Class interface
export interface IClass {
  _id?: string; // MongoDB ObjectId as string
  className: string;
  name?: string; // Alias for className for compatibility
  description?: string;
  status?: string; // "Active", "Inactive", "Draft", etc.
  createdBy: IClassCreator;
  organizationId?: Types.ObjectId;
  courses: Types.ObjectId[];
  students: Types.ObjectId[];
  maxStudents?: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  settings?: IClassSettings;
  metadata?: IClassMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// DTO interfaces
export interface ICreateClassDto {
  className: string;
  description?: string;
  courses?: string[];
  students?: string[];
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
  settings?: IClassSettings;
  metadata?: IClassMetadata;
  organizationId?: string;
}

export interface IUpdateClassDto {
  className?: string;
  description?: string;
  courses?: string[];
  students?: string[];
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
  settings?: IClassSettings;
  metadata?: IClassMetadata;
}

export interface IUpdateClassSettingsDto {
  allowStudentEnrollment?: boolean;
  requireApproval?: boolean;
  autoProgress?: boolean;
}

export interface IAddStudentDto {
  studentId: string;
}

export interface IRemoveStudentDto {
  studentId: string;
}

export interface IAddCourseDto {
  courseId: string;
}

export interface IRemoveCourseDto {
  courseId: string;
}

export interface ICreateApplicationDto {
  organizationId: string;
  message?: string;
}

export interface IReviewApplicationDto {
  status: string;
  reviewMessage?: string;
}

export interface IExtendClassDto {
  endDate: string;
}

// Stats interface
export interface IClassStats {
  totalStudents: number;
  totalCourses: number;
  averageProgress: number;
  activeStudents: number;
}

// Organization Application interfaces
export interface IOrganizationApplication {
  id: string;
  organizationId: Types.ObjectId;
  classId: Types.ObjectId;
  status: string;
  message?: string;
  reviewMessage?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
