import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../db/schema/schema";
import { NextFunction, Request, Response } from "express";

export const registerUserSchema = createInsertSchema(users, {
  id: (schema) => schema.id.positive(),
  email: (schema) => schema.email.email(),
  password: (schema) =>
    schema.password.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
    ),
  role: z.string(),
});

export function validateRegisterUser(req: Request, res: Response, next: NextFunction) {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path[0]} ${issue.message}`
    );
    return res.status(400).json({ errors });
  }
  next();
}

const loginUSerSchema = registerUserSchema.pick({
  password: true,
  email: true,
});
export function validateLoginUser(req: Request, res: Response, next: NextFunction) {
  const result = loginUSerSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path[0]} ${issue.message}`
    );
    return res.status(400).json({ errors });
  }
  next();
}
