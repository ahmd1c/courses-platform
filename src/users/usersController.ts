import { UserServicesInstance } from "./userServices";
import asyncHandler from "../utils/asyncHandler";

export const getAllUsersController = asyncHandler(async (req, res, next) => {
  const users = await UserServicesInstance.getAllUsers();
  res.status(200).json({ users });
});

export const insertProfileController = asyncHandler(async (req, res, next) => {
  const data = {
    userId: req.user?.id!,
    bio: req.body.bio,
  };
  const profile = await UserServicesInstance.insertProfile(data);
  res.status(201).json({ profile });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const profile = await UserServicesInstance.getProfile(+req.params.id);
  res.status(200).json({ profile });
});

export const getSelfProfile = asyncHandler(async (req, res, next) => {
  const profile = await UserServicesInstance.getProfile(req.user?.id!);
  res.status(200).json({ profile });
});

export const updateProfileController = asyncHandler(async (req, res, next) => {
  const profile = await UserServicesInstance.updateProfile(req.user?.id!, req.body.bio);
  res.status(201).json({ profile });
});
