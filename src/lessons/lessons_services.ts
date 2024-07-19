import { LessonRepository, LessonModel } from "./LessonsRepo";
import { TLesson } from "../types";
import { AppError } from "../errorHandler/App-error-class";
import { EnrollementServicesInstance } from "../enrollment/enrollement_services";

const isAdminOrInstructor = async (
  user: { id: number; role: string },
  lessonId: number
) => {
  if (
    user.role !== "admin" &&
    !(await LessonModel.findOne({ id: lessonId, instructorId: user.id }))
  ) {
    throw new AppError("Unauthorized", 401);
  }
  return true;
};

class LessonServices {
  constructor(private readonly LessonModel: LessonRepository) {
    this.LessonModel = LessonModel;
  }

  async getAllLessonsForCourse(courseId: number) {
    const lessons = await this.LessonModel.findMany({
      filter: { courseId },
      fields: [
        "id",
        "title",
        "description",
        "duration",
        "position",
        "isPublished",
        "isFree",
        "courseId",
      ],
    });
    if (!lessons.length) throw new AppError("Lessons Not Found", 404);
    return lessons;
  }

  async insertLesson(lesson: TLesson) {
    const [newLesson] = await this.LessonModel.insert(lesson);
    if (!newLesson) throw new AppError("Lesson Not Created", 500);
    return newLesson;
  }

  async addVideo(lessonId: number, user: { id: number; role: string }, videoUrl: string) {
    await isAdminOrInstructor(user, lessonId);
    const [lessonWithVideo] = await this.LessonModel.update(
      {
        id: lessonId,
      },
      {
        videoUrl,
      }
    );
    if (!lessonWithVideo) throw new AppError("Lesson Not Found", 404);
    return lessonWithVideo;
  }

  async getLesson(
    lessonId: number,
    courseId: number,
    user: { id: number; role: string }
  ) {
    // CHECK IF USER HAS ACCESS TO THIS LESSON OR THE USER IS INSTRUCTOR OF THE COURSE OR ADMIN
    if (
      !(await isAdminOrInstructor(user, lessonId)) &&
      !(await EnrollementServicesInstance.getEnrollementStatus(user.id!, courseId))
    ) {
      throw new AppError("Unauthorized", 403);
    }

    const [lesson] = (await this.LessonModel.findOne({ id: lessonId })) as TLesson[];
    if (!lesson) throw new AppError("Lesson Not Found", 404);
    return lesson;
  }

  async updateOne(lessonId: number, user: { id: number; role: string }, lesson: TLesson) {
    await isAdminOrInstructor(user, lessonId);
    const [updatedLesson] = await this.LessonModel.update(
      {
        id: lessonId,
      },
      lesson
    );
    if (!updatedLesson) throw new AppError("Lesson Not Found", 404);
    return updatedLesson;
  }

  async deleteOne(lessonId: number, user: { id: number; role: string }) {
    await isAdminOrInstructor(user, lessonId);
    const [deletedLesson] = await this.LessonModel.delete({
      id: lessonId,
    });
    if (!deletedLesson) throw new AppError("Lesson Not Found", 404);
    return deletedLesson;
  }
}

export const LessonServicesInstance = new LessonServices(LessonModel);
