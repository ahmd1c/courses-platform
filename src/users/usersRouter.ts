import { Router } from "express";
import {
  getAllUsersController,
  insertProfileController,
  updateProfileController,
} from "./usersController";
import { allowedRoles, authUser } from "../utils/authentication";
import { validateInsertProfile, validateUpdateProfile } from "../validation/users";
import whishlistRouter from "../whishlist/whishlist-router";

const router = Router();

router.get("/", authUser, allowedRoles(["admin"]), getAllUsersController);
router.post("/profiles", authUser, validateInsertProfile, insertProfileController);
router.put("/profiles", authUser, validateUpdateProfile, updateProfileController);

router.use("/whishlist", whishlistRouter);
export default router;
