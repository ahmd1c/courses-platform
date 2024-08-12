import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { TProjection } from "../../types";
import { and, eq, getTableColumns } from "drizzle-orm";

export const project = <T extends PgTableWithColumns<any>>(
  fields: TProjection<T["$inferSelect"]> | undefined,
  table: T
) => {
  if (!fields || Object.keys(fields).length === 0) return getTableColumns(table);
  const selectedFields: T["_"]["columns"] = {};
  for (const field of Object.keys(fields)) {
    if (fields[field]) {
      selectedFields[field] = getTableColumns(table)[field];
    }
  }
  return selectedFields;
};

export const filter = <T extends PgTableWithColumns<any>>(
  filterObj: Partial<T["$inferSelect"]>,
  table: T
) => {
  const filterArr = Object.entries(filterObj).map(([key, value]) => {
    return eq(table[key], value);
  });
  return and(...filterArr);
};
