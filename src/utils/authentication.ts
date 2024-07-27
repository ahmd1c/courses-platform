import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import { UserServicesInstance } from "../users/userServices";
import { Request } from "express";
import { AppError } from "../errorHandler/App-error-class";

export const authUser = asyncHandler(async (req, res, next) => {
  if (!req.cookies?.token) throw new AppError("UnAuthenticated , please login", 401);
  const decoded = jwt.verify(req.cookies.token, process.env.SECRET_KEY!) as JwtPayload;
  const user = await UserServicesInstance.getUserById(decoded.id);
  if (!user) throw new AppError("User Not Found", 404);
  req.user = { id: user.id!, role: user.role! };
  next();
});

export const allowedRoles = (roles: string[]) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user?.role! || "")) {
      throw new AppError("You are not allowed to perform this action", 403);
    }
    next();
  });
};

export const isOwner = (authId: number, resourceUserId: number) => {
  return authId === resourceUserId;
};

export const isAuthenticated = (req: Request) => {
  return (
    req.user?.id !== undefined &&
    req.user?.id !== null &&
    !isNaN(req.user?.id) &&
    req.user?.id > 0
  );
};
