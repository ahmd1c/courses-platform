import { courses } from "../db/schema/schema";
import { createInsertSchema } from "drizzle-zod";
import { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../utils/authentication";

const insertCourseSchema = createInsertSchema(courses, {
  id: (schema) => schema.id.positive(),
});

export function validateInsertCourse(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertCourseSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}

export function validateUpdateCourse(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: "Un authorized",
    });
  }
  const result = insertCourseSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}
