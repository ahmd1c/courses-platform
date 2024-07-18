import { CouponsModel } from "../coupon/coupons-repo";
import { AppError } from "../errorHandler/App-error-class";

class CouponsService {
  async getCoupons() {
    const coupons = await CouponsModel.findMany();
    if (!coupons.length) throw new AppError("coupons not found", 404);
    return coupons;
  }

  async getCoupon(couponId: number) {
    const coupon = await CouponsModel.findOne({ couponId });
    if (!coupon) throw new AppError("coupon not found", 404);
    return coupon;
  }

  async createCoupon(couponDetails: any) {
    const [newCoupon] = await CouponsModel.insert(couponDetails);
    if (!newCoupon) throw new AppError("coupon not created", 500);
    return newCoupon;
  }

  async updateCoupon(couponId: number, couponDetails: any) {
    const [updatedCoupon] = await CouponsModel.update({ couponId }, couponDetails);
    if (!updatedCoupon) throw new AppError("coupon not found", 404);
    return updatedCoupon;
  }

  async deleteCoupon(couponId: number) {
    const [deletedCoupon] = await CouponsModel.delete({ couponId });
    if (!deletedCoupon) throw new AppError("coupon not found", 404);
    return deletedCoupon;
  }
}

export const CouponServicesInstance = new CouponsService();
