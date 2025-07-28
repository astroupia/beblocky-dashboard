import { Types } from "mongoose";

export interface IAdmin {
  _id?: string; // MongoDB ObjectId as string
  userId: string; // String ID from better-auth
  permissions: string[];
  organizationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAdminDto {
  permissions: string[];
  organizationId: Types.ObjectId;
}

export interface IUpdateAdminDto {
  permissions?: string[];
  organizationId?: Types.ObjectId;
}
