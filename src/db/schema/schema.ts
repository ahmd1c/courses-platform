import { index } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import {
  pgEnum,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "instructor", "admin"]);
export const typeOfDiscountEnum = pgEnum("type_of_discount", ["fixed", "percentage"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  passwordChangedAt: timestamp("password_changed_at"),
  passwordResetToken: text("password_reset_token"),
  passwordResetTokenExpires: timestamp("password_reset_expires"),
  role: roleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  bio: text("bio").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    title: varchar("name", { length: 255 }).notNull().unique(),
    isFree: boolean("is_free").default(false),
    price: numeric("price", { precision: 6, scale: 2 }).notNull(),
    rating: numeric("rating", { precision: 2, scale: 1 }),
    isPublished: boolean("is_published").default(false),
    thumbnail: text("image").notNull(),
    description: text("description").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "no action",
        onUpdate: "cascade",
      }),
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    index: index("courses_idx").on(table.id),
  })
);

export const enrollments = pgTable(
  "enrollments",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.courseId],
    }),
  })
);

export const lessons = pgTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    title: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    duration: integer("duration").notNull(), // in minutes
    position: integer("position").notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    isFree: boolean("is_free").notNull().default(false),
    videoUrl: text("video_url").notNull(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    index: index("courseId").on(table.courseId),
  })
);

export const reviews = pgTable("reviews", {
  reviewId: serial("review_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const whishlists = pgTable(
  "wishlists",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.courseId],
    }),
  })
);

export const orders = pgTable(
  "orders",
  {
    orderId: serial("order_id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null", onUpdate: "cascade" }),
    subTotal: numeric("sub_total", { precision: 6, scale: 2 }).notNull(),
    couponId: integer("coupon_id").references(() => coupons.couponId, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    total: numeric("total", { precision: 6, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    index: index("order_idx").on(table.userId),
  })
);

export const orderItems = pgTable(
  "order_items",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.orderId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.orderId, table.courseId],
    }),
  })
);

export const coupons = pgTable(
  "coupons",
  {
    couponId: serial("coupon_id").primaryKey(),
    code: varchar("code", { length: 255 }).notNull(),
    discount: integer("discount").notNull(),
    maxDiscount: integer("discount").notNull(),
    typeOfDiscount: typeOfDiscountEnum("type_of_discount").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiryDate: timestamp("expiry_date").notNull(),
  },
  (table) => ({
    index: index("code").on(table.code),
  })
);

export const couponUsage = pgTable(
  "coupon_usage",
  {
    couponId: integer("coupon_id")
      .notNull()
      .references(() => coupons.couponId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.couponId, table.userId] }),
  })
);
