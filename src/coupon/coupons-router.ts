import { Router } from "express";
import {
  deleteCouponController,
  getAllCouponsController,
  getCouponByIdController,
  insertCouponController,
  updateCouponController,
} from "./coupon-controller";
import { allowedRoles, authUser } from "../utils/authentication";

const router = Router();

router.post("/", authUser, allowedRoles(["admin"]), insertCouponController);
router.get("/", authUser, allowedRoles(["admin"]), getAllCouponsController);
router.get("/:couponId", authUser, allowedRoles(["admin"]), getCouponByIdController);
router.put("/:couponId", authUser, allowedRoles(["admin"]), updateCouponController);
router.delete("/:couponId", authUser, allowedRoles(["admin"]), deleteCouponController);

export default router;
