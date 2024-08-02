import { reviews } from "../db/schema/schema";
import { createInsertSchema } from "drizzle-zod";
import { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../utils/authentication";

const insertReviewSchema = createInsertSchema(reviews, {
  reviewId: (schema) => schema.reviewId.positive(),
});

export function validateInsertReview(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertReviewSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}

export function validateUpdateReview(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertReviewSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}
