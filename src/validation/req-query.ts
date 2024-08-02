import { object, string, number, optional, coerce, array, union, literal } from "zod";
import { AppError } from "../errorHandler/App-error-class";

const price_rating_schema = coerce
  .number()
  .positive()
  .or(
    object({
      gte: optional(coerce.number({ message: "should be a positive valid number" })),
      lte: optional(coerce.number({ message: "should be a positive valid number" })),
    })
  );

const filterSchema = object({
  price: optional(price_rating_schema),
  rating: optional(price_rating_schema),
  categoryId: optional(coerce.number({ message: "should be a positive valid number" })),
});

const querySchema = object({
  filter: filterSchema.optional(),
  sort: optional(
    object({
      createdAt: optional(literal("asc").or(literal("desc"))),
      price: optional(literal("asc").or(literal("desc"))),
      rating: optional(literal("asc").or(literal("desc"))),
    })
  ),
  limit: optional(number().positive()),
  page: optional(number().positive()),
  fields: optional(array(string()).or(string())),
  keyword: optional(string()),
  searchFields: optional(
    array(
      union([literal("description"), literal("title"), literal("name"), literal("email")])
    )
  ),
});

export const validateQuery = (query: unknown) => {
  if (!query) return;
  console.log(query);

  const result = querySchema.safeParse(query);
  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path[0]} ${issue.message}`
    );
    throw new AppError(errors.join("\n"), 400);
  }
  return result.data;
};
