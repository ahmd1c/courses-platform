import { eq } from "drizzle-orm";
import db from "../db";
import BaseRepository from "../db/BaseRepository";
import { courses, lessons, users } from "../db/schema/schema";

export class CourseRepository extends BaseRepository<typeof courses> {
  async getCourseWithContent(courseId: number) {
    return await db
      .select({
        id: this.table.id,
        title: this.table.title,
        description: this.table.description,
        thumbnail: this.table.thumbnail,
        createdAt: this.table.createdAt,
        updatedAt: this.table.updatedAt,
        instructorId: this.table.instructorId,
        content: {
          id: lessons.id,
          title: lessons.title,
          position: lessons.position,
          duration: lessons.duration,
        },
        instructorName: users.name,
      })
      .from(this.table)
      .where(eq(this.table.id, courseId))
      .innerJoin(lessons, eq(this.table.id, lessons.courseId))
      .innerJoin(users, eq(this.table.instructorId, users.id));
  }
}

export const CourseModel = new CourseRepository(courses);
