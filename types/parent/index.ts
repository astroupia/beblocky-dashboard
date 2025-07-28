import { Types } from "mongoose";
import { ICreateUserDto, IUpdateUserDto } from "../user";

export interface IParent {
  _id?: string; // MongoDB ObjectId as string
  userId: string; // String ID from better-auth
  children: Types.ObjectId[]; // Array of student IDs
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateParentDto extends ICreateUserDto {
  children?: Types.ObjectId[];
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export type IUpdateParentDto = Partial<ICreateParentDto> &
  Partial<IUpdateUserDto>;
