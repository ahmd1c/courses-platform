import asyncHandler from "../utils/asyncHandler";
import { OrderServicesInstance } from "./orders-services";

export const getAllOrdersController = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "admin") {
    const orders = await OrderServicesInstance.getAllOrders({
      filter: { userId: req.user?.id! },
    });
  } else {
    const orders = await OrderServicesInstance.getAllOrders(req.query);
    res.status(200).json({ orders });
  }
});

export const getOrderController = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user?.role === "admin" ? undefined : req.user?.id;
  const order = await OrderServicesInstance.getOrder(parseInt(orderId), userId);
  res.status(200).json({ order });
});
