import { CourseModel, CourseRepository } from "./coursesRepo";
import { TQueryObj, TCourse } from "../types";
import { AppError } from "../errorHandler/App-error-class";

class CourseServices {
  constructor(private readonly CoursesModel: CourseRepository) {
    this.CoursesModel = CoursesModel;
  }

  async createCourse(course: TCourse) {
    const [isCourseExists] = (await this.CoursesModel.findOne({
      title: course.title,
    })) as TCourse[];
    if (isCourseExists) throw new AppError("Course Already Exists", 409);
    const [newCourse] = await this.CoursesModel.insert(course);
    if (!newCourse) throw new AppError("Course Not Created", 500);
    return newCourse;
  }

  async getAllCourses(options?: TQueryObj) {
    const courses = await this.CoursesModel.findMany(options);
    if (!courses.length) throw new AppError("Courses Not Found", 404);
    return courses;
  }
  async getCourse(filterObj: Partial<TCourse>) {
    const [course] = (await this.CoursesModel.findOne(filterObj)) as TCourse[];
    if (!course) throw new AppError("Course Not Found", 404);
    return course;
  }

  async getCourseContent(courseId: number) {
    const [courseWithContent] = await this.CoursesModel.getCourseWithContent(courseId);
    if (!courseWithContent) throw new AppError("Course Not Found", 404);
    return courseWithContent;
  }

  async updateCourse(courseId: number, instructorId: number, course: Partial<TCourse>) {
    const [updatedCourse] = await this.CoursesModel.update(
      {
        id: courseId,
        instructorId,
      },
      course
    );
    if (!updatedCourse) throw new AppError("Course Not Found", 404);
    return updatedCourse;
  }

  async deleteCourse(courseId: number, instructorId: number) {
    const [deletedCourse] = await this.CoursesModel.delete({
      id: courseId,
      instructorId,
    });
    if (!deletedCourse) throw new AppError("Course Not Found", 404);
    return deletedCourse;
  }
}

export const CourseServicesInstance = new CourseServices(CourseModel);
