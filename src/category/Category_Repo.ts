import BaseRepository from "../db/BaseRepository";
import { categories } from "../db/schema/schema";

export class CategoryRepository extends BaseRepository<typeof categories> {}
export const CategoryeModel = new CategoryRepository(categories);
