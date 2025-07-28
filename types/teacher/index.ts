import { Types } from "mongoose";
import { ICreateUserDto, IUpdateUserDto } from "../user";

export interface IQualification {
  degree: string;
  institution: string;
  year: number;
  specialization: string;
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export interface ITeacher {
  _id?: string; // MongoDB ObjectId as string
  userId: string; // String ID from better-auth
  qualifications: IQualification[];
  availability: Map<string, ITimeSlot[]>;
  rating: number[];
  courses: Types.ObjectId[];
  organizationId: Types.ObjectId;
  languages: string[];
  subscription?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeacherDto extends ICreateUserDto {
  qualifications?: IQualification[];
  availability?: Map<string, ITimeSlot[]>;
  rating?: number[];
  courses?: Types.ObjectId[];
  organizationId: Types.ObjectId;
  languages?: string[];
  subscription?: Types.ObjectId;
}

export type IUpdateTeacherDto = Partial<ICreateTeacherDto> &
  Partial<IUpdateUserDto>;
