import { and, eq, gt } from "drizzle-orm";
import db from "../db";
import { TUser } from "../types";
import { profiles, users } from "../db/schema/schema";
import BaseRepository from "../db/BaseRepository";

export class UserRepository extends BaseRepository<typeof users> {
  override async insert(data: TUser) {
    return db.transaction(async (tx) => {
      try {
        const result = await tx.insert(users).values(data).returning();
        await tx.insert(profiles).values({ userId: result[0].id, bio: "write your bio" });
        return result;
      } catch (err) {
        console.log(err);
        throw new Error("Failed to create user");
      }
    });
  }

  async findByResetToken(resetToken: string) {
    return db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, resetToken),
          gt(users.passwordResetTokenExpires, new Date(Date.now()))
        )
      );
  }
}
export const UserModel = new UserRepository(users);
