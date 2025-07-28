import { Types } from "mongoose";

export enum SubscriptionType {
  FREE = "free",
  STARTER = "starter",
  BUILDER = "builder",
  PRO = "pro-bundle",
  ORGANIZATION = "organization",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export interface ISubscription {
  userId: string; // String ID from better-auth
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  features: string[];
  price: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriptionDto {
  type: SubscriptionType;
  startDate: Date;
  endDate: Date;
  features: string[];
  price: number;
  currency: string;
  autoRenew?: boolean;
  paymentMethod?: string;
}

export interface IUpdateSubscriptionDto {
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  endDate?: Date;
  features?: string[];
  price?: number;
  currency?: string;
  autoRenew?: boolean;
  paymentMethod?: string;
}

export interface ISubscriptionResponse {
  id: string;
  userId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  features: string[];
  price: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
