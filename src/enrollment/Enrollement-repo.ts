import BaseRepository from "../db/BaseRepository";
import { enrollments } from "../db/schema/schema";

export class EnrollementRepository extends BaseRepository<typeof enrollments> {}
export const EnrollementModel = new EnrollementRepository(enrollments);
