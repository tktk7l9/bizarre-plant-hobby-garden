import { ProductWithPrices } from "@/app/types";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Products",
};

export default async function Page() {
  const headersData = headers();
  const protocol = headersData.get("x-forwarded-proto");
  const host = headersData.get("host");
  const apiBase = `${protocol}://${host}`;
  const products: Array<ProductWithPrices> = await fetch(
    `${apiBase}/api/prices`,
    {
      next: {
        revalidate: 10 * 60, // 10 minutes
      },
    }
  ).then((data) => data.json());
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left md:gap-10">
        <h1 className="text-4xl font-extrabold">植物一覧</h1>
        {products.map((product) => {
          return (
            <section key={product.id} className="bg-white pb-10 rounded-lg">
              <Image
                src={product.images[0]}
                alt={`Product image of ${product.name}`}
                width={350}
                height={500}
                className="rounded-t-lg"
              />
              <div className="px-10 mt-5">
                <h2 className="text-xl font-bold">{product.name}</h2>
                {product.prices.map((price) => {
                  if (price.recurring) return null;
                  return (
                    <form
                      action={`/api/checkout`}
                      method="POST"
                      key={price.id}
                      className="flex justify-between my-2 items-center"
                    >
                      <input type="hidden" name="price_id" value={price.id} />
                      <span>
                        {price.unit_amount?.toLocaleString()}{" "}
                        {price.currency === "jpy"
                          ? "円"
                          : price.currency.toUpperCase()}
                      </span>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        購入する
                      </button>
                    </form>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
