import { LessonServicesInstance } from "./lessons_services";
import asyncHandler from "../utils/asyncHandler";

export const getAllLessonsController = asyncHandler(async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  const lessons = await LessonServicesInstance.getAllLessonsForCourse(courseId);
  res.status(200).json({ lessons });
});

export const getLessonController = asyncHandler(async (req, res, next) => {
  const { lessonId, courseId } = req.params;
  const lesson = await LessonServicesInstance.getLesson(
    parseInt(lessonId),
    parseInt(courseId),
    req.user!
  );
  res.status(200).json({ lesson });
});

export const insertLessonController = asyncHandler(async (req, res, next) => {
  const newLesson = await LessonServicesInstance.insertLesson({
    ...req.body,
    instructorId: req.user?.id,
  });
  if (!newLesson) throw new Error("Lesson Not added");
  res.status(201).json({ newLesson });
});

export const insertVideoController = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new Error("File Not Found");
  const { lessonId } = req.params;
  const lessonWithVideo = await LessonServicesInstance.addVideo(
    parseInt(lessonId),
    req.user!,
    req.file.path
  );
  res.status(201).json({ lessonWithVideo });
});

export const updateLessonController = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const updatedLesson = await LessonServicesInstance.updateOne(
    parseInt(lessonId),
    req.user!,
    req.body
  );
  res.status(200).json({ updatedLesson });
});

export const deleteLessonController = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const deletedLesson = await LessonServicesInstance.deleteOne(
    parseInt(lessonId),
    req.user!
  );
  res.status(200).json({ deletedLesson });
});
