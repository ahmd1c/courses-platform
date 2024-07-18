import { EnrollementServicesInstance } from "./enrollement_services";
import asyncHandler from "../utils/asyncHandler";

export const insertEnrollmentController = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { id: userId } = req.user!;
  const { courseStatus, url } = await EnrollementServicesInstance.insertEnrollement(
    userId,
    parseInt(courseId)
  );
  const response =
    courseStatus === "paid" ? { url } : { message: "enrolled successfully" };
  res.status(200).json(response);
});

export const getEnrollementStatusController = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { id: userId } = req.user!;
  const enrollment = await EnrollementServicesInstance.getEnrollementStatus(
    userId,
    parseInt(courseId)
  );
  res.status(200).json({ success: true, enrollment });
});
