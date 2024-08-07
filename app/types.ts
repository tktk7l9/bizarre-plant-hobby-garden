import Stripe from "stripe";

export type ProductWithPrices = Stripe.Product & {
  prices: Array<Stripe.Price>;
};
