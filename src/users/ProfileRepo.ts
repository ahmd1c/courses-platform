import { profiles } from "../db/schema/schema";
import BaseRepository from "../db/BaseRepository";

export class ProfileRepository extends BaseRepository<typeof profiles> {}
export const ProfileModel = new ProfileRepository(profiles);
