import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category_controller";
import { allowedRoles, authUser } from "../utils/authentication";

const router = Router();

router.get("/", getAllCategoriesController);
router.post("/", authUser, allowedRoles(["admin"]), createCategoryController);
router.put("/:categoryId", authUser, allowedRoles(["admin"]), updateCategoryController);

router.delete(
  "/:categoryId",
  authUser,
  allowedRoles(["admin"]),
  deleteCategoryController
);

export default router;
