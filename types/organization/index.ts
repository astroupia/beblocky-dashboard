import { Types } from 'mongoose';

export interface IOrganization {
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  logo?: string;
  website?: string;
  description?: string;
  teachers: Types.ObjectId[];
  courses: Types.ObjectId[];
  subscriptionId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrganizationDto {
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  logo?: string;
  website?: string;
  description?: string;
}

export interface IUpdateOrganizationDto
  extends Partial<ICreateOrganizationDto> {
  teachers?: Types.ObjectId[];
  courses?: Types.ObjectId[];
  subscriptionId?: Types.ObjectId;
}

export interface IFindByEmailDto {
  email: string;
}
