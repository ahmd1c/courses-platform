import { createInsertSchema } from "drizzle-zod";
import { profiles } from "../db/schema/schema";
import { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../utils/authentication";

const insertProfileSchema = createInsertSchema(profiles, {
  id: (schema) => schema.id.positive(),
});

export function validateInsertProfile(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertProfileSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}

export function validateUpdateProfile(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertProfileSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}
