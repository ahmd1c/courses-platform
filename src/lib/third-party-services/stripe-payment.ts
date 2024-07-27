import Stripe from "stripe";
import { TCoupon, TCourse } from "../../types";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const stripePayment = async (
  courses: Pick<TCourse, "price" | "title" | "id">[],
  userId: string,
  coupon?: TCoupon
) => {
  let discount: string | undefined;
  if (coupon) {
    const discountResponse = await stripe.coupons.create({
      amount_off: coupon.typeOfDiscount === "fixed" ? coupon.discount : undefined,
      percent_off: coupon.typeOfDiscount === "percentage" ? coupon.discount : undefined,
      expand: ["discount"],
      duration: "once",
      name: coupon.code,
      id: String(coupon.id),
    });
    discount = discountResponse.id;
  }
  const lineItems = courses.map((course: Partial<TCourse>) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: course.title!,
        },
        unit_amount: Number(course.price) * 100, // Convert to cents
      },
      quantity: 1,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    metadata: {
      coursesIds: JSON.stringify(courses.map((course) => course.id)),
      user: userId,
      coupon: discount ? discount : null,
    },
    discounts: discount ? [{ coupon: discount }] : undefined,
    mode: "payment",
    success_url: `https://${process.env.CLIENT_URL}/success`,
    cancel_url: `https://${process.env.CLIENT_URL}/cancel`,
  });

  return session;
};
