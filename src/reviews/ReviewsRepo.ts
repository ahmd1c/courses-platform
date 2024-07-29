import { reviews } from "../db/schema/schema";
import BaseRepository from "../db/BaseRepository";

export class ReviewRepository extends BaseRepository<typeof reviews> {}
export const ReviewModel = new ReviewRepository(reviews);
