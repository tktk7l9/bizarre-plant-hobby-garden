import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="relative bg-white">
          <nav
            aria-label="Top"
            className="max-w-7xl mx-auto py-2 px-4 sm:px-6 md:px-8"
          >
            <div className="h-16 flex items-center">
              <div className="hidden md:ml-8 md:block md:self-stretch">
                <div className="h-full flex space-x-8">
                  <Link
                    href="/"
                    className="flex items-center text-sm font-medium text-gray-700 hover:underline"
                  >
                    珍奇植物趣味園芸
                  </Link>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6">
                  <Link
                    href="/products"
                    className="flex items-center text-sm font-medium text-gray-700 hover:underline"
                  >
                    植物一覧
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
