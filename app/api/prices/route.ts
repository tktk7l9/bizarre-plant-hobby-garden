import { NextResponse } from "next/server";
import { ProductWithPrices } from "@/app/types";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function GET() {
  const { data: prices } = await stripe.prices.list({
    limit: 100,
    expand: ["data.product"],
  });
  const products: Array<ProductWithPrices> = [];
  prices.forEach((price) => {
    const product = price.product as Stripe.Product;
    // Stripe CLIが生成するサンプルデータを除外する
    if (product.description === "(created by Stripe CLI)") {
      return;
    }
    const productIndex = products.findIndex((prod) => prod.id === product.id);
    const _price = {
      ...price,
      product: product.id,
    };
    if (productIndex < 0) {
      const _product: ProductWithPrices = {
        ...product,
        prices: [_price],
      };
      products.push(_product);
    } else {
      const targetProduct = products[productIndex];
      targetProduct.prices.push(_price);
      products[productIndex] = targetProduct;
    }
  });
  return NextResponse.json(products);
}
