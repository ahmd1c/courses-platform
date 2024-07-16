import { Router } from "express";
import {
  forgotPasswordController,
  logOutUserController,
  loginUserController,
  registerUserController,
  resetPasswordController,
  updatePasswordController,
} from "./auth_controller";
import { validateLoginUser, validateRegisterUser } from "../validation/auth";
import { authUser } from "../utils/authentication";

const router = Router();

router.post("/register", validateRegisterUser, registerUserController);
router.post("/login", validateLoginUser, loginUserController);
router.get("/logout", authUser, logOutUserController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.patch("/update-password", authUser, updatePasswordController);

export default router;
