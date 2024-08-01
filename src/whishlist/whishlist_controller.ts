import { WhishlistServicesInstance } from "./whishlist_services";
import asyncHandler from "../utils/asyncHandler";

export const getWhishList = asyncHandler(async (req, res, next) => {
  if (!req.user?.id) throw new Error("User Not Found");
  const whishlist = await WhishlistServicesInstance.getWhishlist(req.user?.id);
  if (!whishlist.length) throw new Error("Whishlist Not Found");
  res.status(200).send(whishlist);
  return;
});

export const addToWhishlist = asyncHandler(async (req, res, next) => {
  if (!req.user?.id) throw new Error("User Not Found");
  const WhishlistItem = await WhishlistServicesInstance.insertOne(
    req.user?.id,
    req.body.courseId
  );
  if (!WhishlistItem) throw new Error("WhishlistItem is already there");
  res.status(200).send(WhishlistItem);
  return;
});

export const removeFromWhishlist = asyncHandler(async (req, res, next) => {
  if (!req.user?.id) throw new Error("User Not Found");
  const deletedWhishlistItem = await WhishlistServicesInstance.deleteOne(
    req.user?.id,
    parseInt(req.params.courseId)
  );
  res.status(200).send(deletedWhishlistItem);
  return;
});

export const clearWhishList = asyncHandler(async (req, res, next) => {
  if (!req.user?.id) throw new Error("Unauthenticated user");
  const isCleared = await WhishlistServicesInstance.clearWhishList(req.user?.id);
  res.status(200).send(isCleared);
  return;
});
