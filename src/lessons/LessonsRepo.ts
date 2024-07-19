import { lessons } from "../db/schema/schema";
import BaseRepository from "./../db/BaseRepository";

export class LessonRepository extends BaseRepository<typeof lessons> {}
export const LessonModel = new LessonRepository(lessons);
