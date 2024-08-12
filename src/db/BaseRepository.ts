import { TQueryObj, TProjection } from "../types";
import db from "./index";
import { desc, count } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import QueryCustomizer from "./db-utils/Api_Features";
import { filter, project } from "./db-utils/prepare-query";

abstract class BaseRepository<T extends PgTableWithColumns<any>> {
  constructor(readonly table: T) {
    this.table = table;
  }

  async insert(data: T["$inferInsert"]) {
    return db.insert(this.table).values(data).returning();
  }

  async countItems() {
    return db.select({ count: count(this.table.id).mapWith(Number) }).from(this.table);
  }

  async findMany(options?: TQueryObj) {
    if (options && Object.keys(options).length) {
      return QueryCustomizer.initialize(options, this.table).build();
    }
    return db.select().from(this.table).orderBy(desc(this.table.createdAt));
  }

  async findOne(
    filterObj: Partial<T["$inferSelect"]>,
    projection?: TProjection<T["$inferSelect"]>
  ) {
    const filteredQuery = filter(filterObj, this.table);
    const selectObj = project(projection, this.table);
    return db.select(selectObj).from(this.table).where(filteredQuery).limit(1);
  }

  async update(
    filterObj: Partial<T["$inferSelect"]>,
    data: Partial<T["$inferInsert"]>,
    projection?: TProjection<T["$inferSelect"]>
  ) {
    const filteredQuery = filter(filterObj, this.table);
    const selectObj = project(projection, this.table);
    return db
      .update(this.table)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(filteredQuery)
      .returning(selectObj);
  }

  async delete(filterObj: Partial<T["$inferSelect"]>) {
    const filteredQuery = filter(filterObj, this.table);
    return db.delete(this.table).where(filteredQuery).returning({ id: this.table.id });
  }
}

export default BaseRepository;
