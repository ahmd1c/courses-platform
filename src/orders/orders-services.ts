import { OrderRepository, OrdersModel } from "./orders_repo";
import { TQueryObj } from "../types";
import { AppError } from "../errorHandler/App-error-class";

type TOrder = {
  orderId?: number;
  userId: number;
  total: number;
  subTotal: number;
  createdAt?: Date;
  couponId?: number;
  orderItems: number[];
};

class OrderServices {
  constructor(private readonly OrdersModel: OrderRepository) {
    this.OrdersModel = OrdersModel;
  }

  async getAllOrders(options?: TQueryObj) {
    const orders = await this.OrdersModel.findMany(options);
    if (!orders.length) throw new AppError("orders not found", 404);
    return orders;
  }

  async getOrder(orderId: number, userId?: number) {
    const [order] = await this.OrdersModel.findOne({ orderId, userId });
    if (!order) throw new AppError("order not found", 404);
    return order;
  }

  async createOrder(orderDetails: TOrder) {
    const data = {
      order: {
        userId: orderDetails.userId,
        total: orderDetails.total,
        subTotal: orderDetails.subTotal,
        couponId: orderDetails.couponId,
      },
      orderItems: orderDetails.orderItems,
    };
    const [newOrder] = await this.OrdersModel.insert(orderDetails);
    if (!newOrder) throw new Error("Failed to create order");
    return newOrder;
  }
}
export const OrderServicesInstance = new OrderServices(OrdersModel);
