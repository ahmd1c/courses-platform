import { and, asc, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { TQueryObj, TFilterArray } from "../../types";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import db from "..";

export class QueryCustomizer {
  private queryObj!: TQueryObj;
  private table!: PgTableWithColumns<any>;
  query: any;

  static initialize(queryObj: TQueryObj, table: PgTableWithColumns<any>) {
    return new QueryCustomizer(queryObj, table);
  }

  constructor(queryObj: TQueryObj, table: PgTableWithColumns<any>) {
    this.queryObj = queryObj;
    this.table = table;
    this.query = null;
  }

  withSelect() {
    let { fields } = this.queryObj;
    let selectObj: Record<string, PgTableWithColumns<any>["$inferSelect"]> = fields
      ? {}
      : this.table;
    fields = fields && typeof fields === "string" ? fields.split(",") : fields;
    if (Array.isArray(fields) && fields.length > 0) {
      for (const field of fields) {
        selectObj[field] = this.table[field];
      }
    }
    this.query = db.select(selectObj).from(this.table);
    return this.query;
  }

  withFilter() {
    // where(and(...filter))
    const { filter, keyword, searchFields } = this.queryObj;
    if (!filter && !keyword) return this.query;
    let filterArr: TFilterArray = [];
    if (filter) {
      for (const [key, value] of Object.entries(filter!)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          value.gte && filterArr.push(gte(this.table[key], value.gte));
          value.lte && filterArr.push(lte(this.table[key], value.lte));
        } else if (typeof value === "number" || "string") {
          filterArr.push(eq(this.table[key], value));
        }
      }
    }

    if (keyword && searchFields?.length) {
      filterArr.push(
        or(...searchFields.map((field) => ilike(this.table[field], `%${keyword}%`)))
      );
    }
    this.query = this.query.where(and(...filterArr)).$dynamic();
    return this.query;
  }

  withSort() {
    if (!this.queryObj.sort) {
      return this.query.orderBy(desc(this.table.createdAt));
    }
    const sortArr = Object.entries(this.queryObj.sort).map(([col, op]) => {
      return op === "asc" ? asc(this.table[col]) : desc(this.table[col]);
    });
    return this.query.orderBy(...sortArr);
  }

  withLimit() {
    this.query = this.query.limit(this.queryObj.limit || 20);
    return this.query;
  }

  withPaginate() {
    const { page, limit = 20 } = this.queryObj;
    const skip = page ? (page - 1) * limit : 0;
    this.query = this.query.offset(skip);
    return this.query;
  }
  build() {
    const { filter, page } = this.queryObj;
    this.query = this.withSelect();
    this.query = filter ? this.withFilter() : this.query;
    // no condition in the following 2 cases because i want to enable limit in all cases and
    // the sort is always included in the query and its default value is createdAt desc
    this.query = this.withSort();
    this.query = this.withLimit();
    this.query = page ? this.withPaginate() : this.query;
    return this.query;
  }
}

export default QueryCustomizer;
