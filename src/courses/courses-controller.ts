import { CourseServicesInstance } from "./courses-service";
import { EnrollementServicesInstance } from "../enrollment/enrollement_services";
import asyncHandler from "../utils/asyncHandler";
import { validateQuery } from "../validation/req-query";

export const createCourseController = asyncHandler(async (req, res, next) => {
  const instructorId = req.user?.id;
  if (req.file) {
    req.body.thumbnail = req.file.path;
  }
  const newCourse = await CourseServicesInstance.createCourse({
    ...req.body,
    instructorId,
  });
  res.status(201).json({ message: "Course Created Successfully", course: newCourse });
});

export const getAllCoursesController = asyncHandler(async (req, res, next) => {
  const queryObj = validateQuery(req.query);
  const courses = await CourseServicesInstance.getAllCourses(queryObj);
  res.status(200).json({ courses });
});

export const getCourseByIdController = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await CourseServicesInstance.getCourse({ id: +courseId });
  res.status(200).json({ course });
});

export const getCourseContentController = asyncHandler(async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  const enrollment = await EnrollementServicesInstance.getEnrollementStatus(
    req.user?.id!,
    courseId
  );
  const course = await CourseServicesInstance.getCourseContent(courseId);
  res.status(200).json({ course });
});

export const updateCourseController = asyncHandler(async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  if (req.file) {
    req.body.thumbnail = req.file.path;
  }
  const course = await CourseServicesInstance.updateCourse(
    courseId,
    req.user?.id!,
    req.body
  );
  res.status(200).json({ course });
});

export const deleteCourseController = asyncHandler(async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  const course = await CourseServicesInstance.deleteCourse(courseId, req.user?.id!);
  res.status(200).json({ course });
});
