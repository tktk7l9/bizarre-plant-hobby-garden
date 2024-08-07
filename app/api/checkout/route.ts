import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const referer = request.headers.get("referer") || "http://localhost:3000";

  if (
    request.headers.get("content-type") === "application/x-www-form-urlencoded"
  ) {
    const body = await request.formData();
    const priceId = body.get("price_id")?.toString();
    if (!priceId) {
      return NextResponse.json(
        {
          message: "Cart is empty",
        },
        {
          status: 400,
        }
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      cancel_url: referer,
      success_url: `${origin}?success=true`,
      mode: "payment",
    });
    if (session.url) {
      return NextResponse.redirect(new URL(session.url), 303);
    } else {
      return NextResponse.json(
        {
          message:
            "Failed to create a new checkout session. Please check your Stripe Dashboard.",
        },
        {
          status: 400,
        }
      );
    }
  } else if (request.headers.get("content-type") === "application/json") {
    /*
        [応用課題] 複数商品の注文をサポートしよう
        このワークショップでは、１商品ごとの注文方法飲み紹介します。
        ですが、Stripe Checkoutでは、複数種類・複数個の注文にも対応しています。

        else if (request.headers.get('content-type') === 'application/json') {}部分を利用して、
        複数個・複数種類の注文を処理する方法を考えてみましょう。
      */
  }
  return NextResponse.json(
    {
      message: "Invalid request",
    },
    {
      status: 400,
    }
  );
}
