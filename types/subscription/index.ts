import { Types } from 'mongoose';
import { CourseSubscriptionType } from '../course';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export interface ISubscription {
  userId: Types.ObjectId;
  planName: CourseSubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentHistory: Array<{
    amount: number;
    date: Date;
    transactionId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriptionDto {
  userId: Types.ObjectId;
  planName: CourseSubscriptionType;
  startDate: Date;
  endDate: Date;
  autoRenew?: boolean;
}

export interface IUpdateSubscriptionDto {
  status?: SubscriptionStatus;
  endDate?: Date;
  autoRenew?: boolean;
}

export interface IAddPaymentDto {
  amount: number;
  transactionId: string;
}

export interface IFindByStatusDto {
  status: SubscriptionStatus;
}

export interface IFindByPlanDto {
  planName: CourseSubscriptionType;
}
