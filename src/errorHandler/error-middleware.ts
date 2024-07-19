import { NextFunction, Request, Response } from "express";
import { AppError } from "./App-error-class";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).send("not found");
};
