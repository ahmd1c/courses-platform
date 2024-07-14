// export const userRelations = relations(users, ({ one, many }) => ({
//   courses: many(courses),
//   reviews: many(reviews),
//   wishlists: many(whishlists),
//   enrollments: many(enrollments),
//   profiles: one(profiles),
// }));

// export const profileRelations = relations(profiles, ({ one }) => ({
//   user: one(users, {
//     fields: [profiles.userId],
//     references: [users.id],
//   }),
// }));

// export const categoryRelations = relations(categories, ({ many }) => ({
//   courses: many(courses),
// }));

// export const courseRelations = relations(courses, ({ one, many }) => ({
//   category: one(categories, {
//     fields: [courses.categoryId],
//     references: [categories.id],
//   }),
//   instructor: one(users, {
//     fields: [courses.instructorId],
//     references: [users.id],
//   }),
//   lessons: many(lessons),
//   reviews: many(reviews),
//   wishlists: many(whishlists),
//   enrollments: many(enrollments),
// }));

// export const enrollmentRelations = relations(enrollments, ({ one }) => ({
//   user: one(users, {
//     fields: [enrollments.userId],
//     references: [users.id],
//   }),
//   course: one(courses, {
//     fields: [enrollments.courseId],
//     references: [courses.id],
//   }),
// }));

// export const lessonRelations = relations(lessons, ({ one }) => ({
//   course: one(courses, {
//     fields: [lessons.courseId],
//     references: [courses.id],
//   }),
//   instructor: one(users, {
//     fields: [lessons.instructorId],
//     references: [users.id],
//   }),
// }));

// export const reviewRelations = relations(reviews, ({ one }) => ({
//   user: one(users, {
//     fields: [reviews.userId],
//     references: [users.id],
//   }),
//   course: one(courses, {
//     fields: [reviews.courseId],
//     references: [courses.id],
//   }),
// }));

// export const wishlistRelations = relations(whishlists, ({ one }) => ({
//   user: one(users, {
//     fields: [whishlists.userId],
//     references: [users.id],
//   }),
//   course: one(courses, {
//     fields: [whishlists.courseId],
//     references: [courses.id],
//   }),
// }));
