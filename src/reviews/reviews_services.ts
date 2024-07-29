import { AppError } from "../errorHandler/App-error-class";
import { TReview } from "../types";
import { ReviewRepository, ReviewModel } from "./ReviewsRepo";

class ReviewServices {
  constructor(private readonly ReviewsModel: ReviewRepository) {
    this.ReviewsModel = ReviewsModel;
  }
  async getCourseReviews(courseId: number) {
    const reviews = await this.ReviewsModel.findMany({
      filter: {
        courseId,
      },
    });
    if (!reviews.length) throw new AppError("Reviews Not Found", 404);
    return reviews;
  }
  async getReviewByUserId(userId: number, courseId: number) {
    const [review] = (await this.ReviewsModel.findOne({
      userId,
      courseId,
    })) as TReview[];
    if (!review) throw new AppError("Review Not Found", 404);
    return review;
  }

  async insertReview(review: TReview) {
    const isReviewed = await this.ReviewsModel.findOne({
      userId: review.userId,
      courseId: review.courseId,
    });
    if (isReviewed) throw new AppError("You Already Reviewed This Course", 409);
    const [newReview] = await this.ReviewsModel.insert(review);
    if (!newReview) throw new AppError("Review Not Created", 500);
    return newReview;
  }

  async updateReview(reviewId: number, userId: number, review: Partial<TReview>) {
    const [updatedReview] = await this.ReviewsModel.update(
      {
        reviewId,
        userId,
      },
      review
    );
    if (!updatedReview) throw new AppError("Review Not Found", 404);
    return updatedReview;
  }

  async deleteReview(reviewId: number, user: { id: number; role: string }) {
    const filter = {
      reviewId,
      ...(user.role === "admin" ? {} : { userId: user.id }),
    };
    const [isDeleted] = await this.ReviewsModel.delete(filter);
    if (!isDeleted) throw new AppError("Review not found", 404);
    return isDeleted;
  }
}

export const ReviewsServicesInstance = new ReviewServices(ReviewModel);
