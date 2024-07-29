import { ReviewsServicesInstance } from "./reviews_services";
import asyncHandler from "../utils/asyncHandler";

export const getCourseReviewsController = asyncHandler(async (req, res, next) => {
  const courseId = parseInt(req.params.courseId);
  const reviews = await ReviewsServicesInstance.getCourseReviews(courseId);
  res.status(200).json({ success: true, reviews });
});

export const insertReviewController = asyncHandler(async (req, res, next) => {
  const reviewData = {
    userId: req.user?.id!,
    courseId: parseInt(req.params.courseId),
    comment: req.body.comment,
    rating: req.body.rating,
  };
  const review = await ReviewsServicesInstance.insertReview(reviewData);
  res.status(201).json({ success: true, review });
});

export const updateReviewController = asyncHandler(async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const { comment, rating } = req.body;
  const newReview = await ReviewsServicesInstance.updateReview(reviewId, req.user?.id!, {
    ...(comment ? { comment } : {}),
    ...(rating ? { rating } : {}),
  });
  res.status(201).json({ success: true, newReview });
});

export const deleteReviewController = asyncHandler(async (req, res, next) => {
  const reviewId = parseInt(req.params.courseId);
  const deletedReview = await ReviewsServicesInstance.deleteReview(reviewId, req.user!);
  res.status(200).json({ deletedReview });
});
