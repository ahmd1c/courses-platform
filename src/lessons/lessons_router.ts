import { Router } from "express";
import { allowedRoles, authUser } from "../utils/authentication";
import {
  deleteLessonController,
  getAllLessonsController,
  getLessonController,
  insertLessonController,
  insertVideoController,
  updateLessonController,
} from "../lessons/lessons_controller";
import { upload } from "../utils/upload";
import { validateInsertLesson, validateUpdateLesson } from "../validation/lessons";

const router = Router({ mergeParams: true });

// used inside course router

router.get("/", getAllLessonsController);
router.get("/:lessonId", getLessonController);
router.post(
  "/",
  authUser,
  allowedRoles(["admin", "instructor"]),
  validateInsertLesson,
  insertLessonController
);
router.put(
  "/:lessonId",
  authUser,
  allowedRoles(["admin", "instructor"]),
  validateUpdateLesson,
  updateLessonController
);
router.post(
  "/:lessonId/upload-video",
  authUser,
  allowedRoles(["admin", "instructor"]),
  upload.single("video"),
  insertVideoController
);
router.delete(
  "/:lessonId",
  authUser,
  allowedRoles(["admin", "instructor"]),
  deleteLessonController
);

export default router;
