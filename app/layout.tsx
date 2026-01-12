import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";

const outfit = Outfit({
  weight: ["400", "800"],
  display: "swap",
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pearion-collections.vercel.app/"),
  title: "Pearion Collections – Elegant Pearl & Jewelry Designs",
  description:
    "Discover Pearion Collections: Premium pearl and fashion jewelry crafted for every occasion. Shop necklaces, earrings, bracelets, and gift-ready sets designed for elegance and style.",
  keywords:
    "Pearion Collections, Pearl Jewelry, Luxury Jewelry, Earrings, Necklaces, Bracelets, Gift Ideas, Pakistani Jewelry Brand, Bridal Jewelry",
  authors: [{ name: "Pearion" }],
  openGraph: {
    title: "Pearion Collections – Elegant Pearl & Jewelry Designs",
    description:
      "Discover Pearion Collections: Premium pearl and fashion jewelry crafted for every occasion.",
    url: "", // replace with your website
    siteName: "Pearion Collections",
    images: [
      {
        url: "/website image/pearion logo.png",
        width: 1200,
        height: 630,
        alt: "Pearion Collections Jewelry",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${outfit.style} antialiased`}>
        <Analytics />
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
