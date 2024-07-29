import { Router } from "express";
import {
  deleteReviewController,
  getCourseReviewsController,
  insertReviewController,
  updateReviewController,
} from "./reviews_controller";
import { authUser } from "../utils/authentication";
import { validateInsertReview, validateUpdateReview } from "../validation/reviews";

const router = Router({
  mergeParams: true,
});

// used inside course router

router.get("/", getCourseReviewsController);
router.post("/", authUser, validateInsertReview, insertReviewController);
router.put("/:reviewId", authUser, validateUpdateReview, updateReviewController);
router.delete("/:reviewId", authUser, deleteReviewController);

export default router;
