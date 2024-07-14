import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/schema.ts",
  dialect: "postgresql",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
