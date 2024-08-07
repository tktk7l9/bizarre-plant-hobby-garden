import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const body = await request.arrayBuffer();
    const event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    if (
      [
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
      ].includes(event.type)
    ) {
      const data = event.data.object as Stripe.Checkout.Session;
      if (data.payment_status === "paid") {
        const customerDetails = data.customer_details;
        console.log({
          name: customerDetails?.name,
          address: customerDetails?.address,
          email: customerDetails?.email,
          phone: customerDetails?.phone,
          amount_total: data.amount_total,
          currency: data.currency,
        });
        const { data: cartItems } =
          await stripe.checkout.sessions.listLineItems(data.id, {
            expand: ["data.price.product"],
          });
        cartItems.forEach((item) => {
          const product = item.price?.product as Stripe.Product;
          console.log({
            product: product.name,
            unit_amount: item.price?.unit_amount,
            currency: item.price?.currency,
            quantity: item.quantity,
            amount_total: item.amount_total,
          });
        });
      }
    } else if (event.type === "checkout.session.async_payment_failed") {
      // 決済が失敗したケース
    }
    return NextResponse.json({
      message: `Hello Stripe webhook!`,
    });
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      (err as Error).message
    }`;
    console.log(errorMessage);
    return new Response(errorMessage, {
      status: 400,
    });
  }
}
