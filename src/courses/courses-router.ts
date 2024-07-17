import { Router } from "express";
import {
  createCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  getCourseContentController,
  updateCourseController,
} from "./courses-controller";
import { allowedRoles, authUser } from "../utils/authentication";
import reviewsRouter from "../reviews/reviews_router";
import {
  getEnrollementStatusController,
  insertEnrollmentController,
} from "../enrollment/enrollment-controller";
import lessonsRouter from "../lessons/lessons_router";
import { upload } from "../utils/upload";

const courseRouter = Router();

courseRouter.post(
  "/",
  authUser,
  allowedRoles(["admin", "instructor"]),
  upload.single("thumbnail"),

  createCourseController
);
courseRouter.get("/", getAllCoursesController);
courseRouter.get("/:courseId", getCourseByIdController);
courseRouter.put(
  "/:courseId",
  authUser,
  allowedRoles(["admin", "instructor"]),
  upload.single("thumbnail"),
  updateCourseController
);
courseRouter.delete(
  "/:courseId",
  authUser,
  allowedRoles(["admin", "instructor"]),
  deleteCourseController
);

// learn
courseRouter.get("/:courseId/content", authUser, getCourseContentController);

// Enrollement
courseRouter.post("/:courseId/enrollment", authUser, insertEnrollmentController);
courseRouter.get("/:courseId/enrollment", authUser, getEnrollementStatusController);

// lessons
courseRouter.use("/:courseId/lessons", lessonsRouter);

// reviews
courseRouter.use("/:courseId/reviews", reviewsRouter);
export default courseRouter;
