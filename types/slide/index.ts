import { Types } from "mongoose";

interface ThemeColorsDto {
  main: string;
  secondary: string;
  accent: string;
}

export interface ISlide {
  _id?: Types.ObjectId;
  title: string;
  content?: string;
  course: Types.ObjectId;
  lesson?: Types.ObjectId;
  order: number;
  titleFont?: string;
  contentFont?: string;
  startingCode?: string;
  solutionCode?: string;
  imageUrls?: string[];
  backgroundColor?: string;
  textColor?: string;
  themeColors?: {
    main: string;
    secondary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSlideDto {
  title: string;
  content?: string;
  courseId: Types.ObjectId;
  lessonId?: Types.ObjectId;
  order: number;
  titleFont?: string;
  contentFont?: string;
  startingCode?: string;
  solutionCode?: string;
  imageUrls?: string[];
  backgroundColor?: string;
  textColor?: string;
  themeColors?: {
    main: string;
    secondary: string;
  };
}

export interface IUpdateSlideDto {
  title?: string;
  content?: string;
  lessonId?: Types.ObjectId;
  order?: number;
  titleFont?: string;
  contentFont?: string;
  startingCode?: string;
  solutionCode?: string;
  imageUrls?: string[];
  backgroundColor?: string;
  textColor?: string;
  themeColors?: {
    main: string;
    secondary: string;
  };
}

export interface IReorderSlidesDto {
  slideIds: Types.ObjectId[];
}

export interface IAddMediaDto {
  mediaUrl: string;
  type: "image" | "video";
}
