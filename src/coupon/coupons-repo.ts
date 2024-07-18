import { coupons } from "../db/schema/schema";
import BaseRepository from "../db/BaseRepository";

export class CouponsRepository extends BaseRepository<typeof coupons> {}
export const CouponsModel = new CouponsRepository(coupons);
