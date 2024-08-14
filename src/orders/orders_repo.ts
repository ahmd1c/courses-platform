import { and, desc, eq } from "drizzle-orm";
import { orders, orderItems, couponUsage, enrollments } from "./../db/schema/schema";
import QueryCustomizer from "../db/db-utils/Api_Features";
import BaseRepository from "../db/BaseRepository";
import db from "../db";

export class OrderRepository extends BaseRepository<typeof orders> {
  override async findMany(options?: any) {
    if (options && Object.keys(options).length) {
      const queryCustomizer = QueryCustomizer.initialize(options, orders);
      return queryCustomizer
        .build()
        .innerJoin(orderItems, eq(orders.orderId, orderItems.orderId));
    }
    return db
      .select()
      .from(orders)
      .innerJoin(orderItems, eq(orders.orderId, orderItems.orderId))
      .orderBy(desc(orders.createdAt));
  }
  override async findOne(filterObj: any) {
    const filter = [
      eq(orders.orderId, filterObj.orderId),
      filterObj.userId ? eq(orders.userId, filterObj.userId) : undefined,
    ];
    return db
      .select()
      .from(orders)
      .where(and(...filter))
      .innerJoin(orderItems, eq(orders.orderId, orderItems.orderId))
      .limit(1);
  }
  override async insert(data: any) {
    try {
      return db.transaction(async (tx) => {
        const newOrder = await tx.insert(orders).values(data.order).returning();
        const orderItemsWithOrderId = data.orderItemsIds.map((item: any) => ({
          courseId: item,
          orderId: newOrder[0].orderId,
        }));
        const orderItemsWithUserId = data.orderItemsIds.map((item: any) => ({
          courseId: item,
          userId: newOrder[0].userId,
        }));
        await tx.insert(orderItems).values(orderItemsWithOrderId);
        await tx.insert(enrollments).values(orderItemsWithUserId);
        if (data.order.coupon) {
          await tx.insert(couponUsage).values({
            couponId: data.order.coupon,
            userId: data.order.userId,
          });
        }
        return newOrder;
      });
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create order");
    }
  }
}

export const OrdersModel = new OrderRepository(orders);
