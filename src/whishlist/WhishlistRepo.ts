import { whishlists } from "../db/schema/schema";
import BaseRepository from "./../db/BaseRepository";

export class WhishlistRepository extends BaseRepository<typeof whishlists> {}
export const WhishlistModel = new WhishlistRepository(whishlists);
