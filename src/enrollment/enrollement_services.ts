import { CourseModel, CourseRepository } from "../courses/coursesRepo";
import { EnrollementRepository, EnrollementModel } from "./Enrollement-repo";
import { TCourse, TEnrollement } from "../types";
import { stripePayment } from "../lib/third-party-services/stripe-payment";
import { AppError } from "../errorHandler/App-error-class";

class EnrollementServices {
  private readonly EnrollementModel: EnrollementRepository;
  private readonly CourseModel: CourseRepository;
  constructor(EnrollementModel: EnrollementRepository, CourseModel: CourseRepository) {
    this.EnrollementModel = EnrollementModel;
    this.CourseModel = CourseModel;
  }

  getEnrollementStatus = async (userId: number, courseId: number) => {
    const [enrollment] = (await this.EnrollementModel.findOne({
      userId,
      courseId,
    })) as TEnrollement[];
    if (!enrollment) throw new AppError("user isn't enrolled in this course", 404);
    return enrollment;
  };

  insertEnrollement = async (userId: number, courseId: number) => {
    const [course] = (await this.CourseModel.findOne({ id: courseId })) as TCourse[];
    if (!course) throw new AppError("Course Not Found", 404);

    const [enrollment] = (await this.EnrollementModel.findOne({
      userId,
      courseId,
    })) as TEnrollement[];
    if (enrollment) throw new AppError("user is Already Enrolled in this course", 409);

    if (course.price === "0") {
      const [newEnrollement] = await this.EnrollementModel.insert({
        userId,
        courseId,
      });
      return {
        courseStatus: "free",
      };
    }
    // checkout
    try {
      const session = await stripePayment(
        [{ title: course.title, price: course.price, id: course.id }],
        String(userId)
      );
      return {
        courseStatus: "paid",
        url: session.url,
      };
    } catch (err) {
      throw new AppError("Payment Failed", 500);
    }
  };
}

export const EnrollementServicesInstance = new EnrollementServices(
  EnrollementModel,
  CourseModel
);
