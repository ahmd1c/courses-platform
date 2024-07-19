import { Router } from "express";
import { allowedRoles, authUser } from "../utils/authentication";
import { getAllOrdersController, getOrderController } from "./orders-controller";

const ordersRouter = Router();

ordersRouter.get("/", authUser, allowedRoles(["admin"]), getAllOrdersController);
ordersRouter.get("/:orderId", authUser, getOrderController);

export default ordersRouter;
