import { CouponServicesInstance } from "./coupon-services";
import asyncHandler from "../utils/asyncHandler";

export const insertCouponController = asyncHandler(async (req, res, next) => {
  const coupon = CouponServicesInstance.createCoupon(req.body);
  res.status(201).json({ coupon });
});

export const getAllCouponsController = asyncHandler(async (req, res, next) => {
  const coupons = CouponServicesInstance.getCoupons();
  res.status(200).json({ coupons });
});

export const getCouponByIdController = asyncHandler(async (req, res, next) => {
  const coupon = CouponServicesInstance.getCoupon(+req.params.couponId);
  res.status(200).json({ coupon });
});

export const updateCouponController = asyncHandler(async (req, res, next) => {
  const coupon = CouponServicesInstance.updateCoupon(+req.params.couponId, req.body);
  res.status(200).json({ coupon });
});

export const deleteCouponController = asyncHandler(async (req, res, next) => {
  const coupon = CouponServicesInstance.deleteCoupon(+req.params.couponId);
  res.status(200).json({ coupon });
});
