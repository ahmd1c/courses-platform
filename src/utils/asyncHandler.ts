import { NextFunction, Request, Response } from "express";
import { MiddlewareFunction } from "../types";

const asyncHandler = (fn: MiddlewareFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
