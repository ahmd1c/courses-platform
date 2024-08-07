import { lessons } from "../db/schema/schema";
import { createInsertSchema } from "drizzle-zod";
import { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../utils/authentication";

const insertLessonSchema = createInsertSchema(lessons, {
  id: (schema) => schema.id.positive(),
});

export function validateInsertLesson(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertLessonSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}

export function validateUpdateLesson(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertLessonSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}
