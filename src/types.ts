import { BinaryOperator, SQL } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { NextFunction, Request, Response } from "express";

declare module "express" {
  export interface Request {
    user?: {
      id: number;
      role: "student" | "instructor" | "admin";
    };
  }
}

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type TUser = {
  id?: number;
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpires?: Date | null;
  role?: "student" | "instructor" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
};

export type TProfile = {
  id?: number;
  bio: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCourse = {
  id?: number;
  title: string;
  price: string; // string because it is a decimal and node-postgres returns it as a string
  isFree: boolean;
  thumbnail: string;
  categoryId: number;
  instructorId: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TLesson = {
  id?: number;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  duration: number;
  courseId: number;
  instructorId: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TEnrollement = {
  [key: string]: any;
  userId: number;
  courseId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TReview = {
  [key: string]: any;
  userId: number;
  courseId: number;
  rating: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCategory = {
  [key: string]: any;
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCoupon = {
  id: number;
  code: string;
  typeOfDiscount: "fixed" | "percentage";
  discount: number;
  maxDiscount: number;
  expiryDate: Date;
  createdAt: Date;
};

export type TProjection<T> = {
  [key in keyof T]: boolean;
};

export type TFilterArray = (BinaryOperator | SQL<unknown> | undefined)[] | any[];
export type TSortArray = SQL<unknown>[] | any[];
export type TSearchedArray = SQL<unknown>[] | any[];

export type TQueryObj = {
  filter?: {
    [key: string]: number | string | { gte?: number; lte?: number };
  };
  sort?: {
    createdAt?: "asc" | "desc";
    price?: "asc" | "desc";
    rating?: "asc" | "desc";
  };
  limit?: number;
  page?: number;
  fields?: string[] | string;
  keyword?: string;
  searchFields?: ("description" | "title" | "name" | "email")[];
};
