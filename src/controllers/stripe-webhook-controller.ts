import { Request, Response } from "express";
import { stripe } from "../lib/third-party-services/stripe-payment";
import { OrderServicesInstance } from "../orders/orders-services";

export const stripeWebhookController = async (req: Request, res: Response) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log(err);
    const message = err instanceof Error ? err.message : "";
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  switch (event?.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      // Handle successful checkout session
      const orderDetails = {
        userId: parseInt(session.metadata?.user!),
        total: Number((session.amount_total! / 100).toFixed(2)),
        subTotal: Number((session.amount_subtotal! / 100).toFixed(2)),
        coupon: session.metadata?.coupon ? parseInt(session.metadata?.coupon) : null,
        orderItems: JSON.parse(session.metadata?.courseIds!),
      };
      OrderServicesInstance.createOrder(orderDetails);
      break;
    default:
      console.log(`Unhandled event type ${event?.type}`);
  }
  res.json({ received: true });
};
