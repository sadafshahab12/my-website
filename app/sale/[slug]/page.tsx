"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { Minus, Plus, Heart, Truck, Shield, Flame, Clock } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import SaleProductCard from "@/app/components/SaleProductCard";
import Link from "next/link";
import { FaCcMastercard } from "react-icons/fa";
import { SaleProduct } from "@/app/types/saleType";
import { motion } from "framer-motion";
import Loading from "@/app/shop/loading";
import Error from "@/app/error";

export type Review = {
  _id: string;
  name: string;
  text: string;
  rating: number;
  _createdAt: string;
};

const SaleDetailPage: React.FC = () => {
  const params = useParams();
  const productSlug = params?.slug as string;

  const [product, setProduct] = useState<SaleProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SaleProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [activeImg, setActiveImg] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { addToCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    if (!productSlug) return;

    const fetchFullData = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "sale" && slug.current == $slug][0]{
          _id,
          _type,
          _createdAt,
          name,
          slug,
          stockQuantity,
          originalPrice,
          discountPrice,
          isSoldOut,
          showSaleBadge,
          promotion,
          category->{ _id, title, slug },
          images[]{ 
            asset->{ _id, url }, 
            alt 
          },
          material,
          colors,
          occasions,
          description,
          careInstructions
        }`;

        const data = await client.fetch<SaleProduct>(query, {
          slug: productSlug,
        });

        if (!data) {
          setError("The product you are looking for could not be found.");
          return;
        }
        setProduct(data);

        if (data.category?._id) {
          const relatedQuery = `*[_type == "sale" && category._ref == $categoryId && slug.current != $slug][0..3]{
            _id,
            name,
            slug,
            originalPrice,
            discountPrice,
            stockQuantity,
            isSoldOut,
            showSaleBadge,
            promotion,
            images[]{ asset->{_id, url}, alt }
          }`;
          const relatedData = await client.fetch<SaleProduct[]>(relatedQuery, {
            categoryId: data.category._id,
            slug: productSlug,
          });
          setRelatedProducts(relatedData);
        }

        const reviewQuery = `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
          _id, name, text, rating, _createdAt
        }`;
        const productReviews = await client.fetch<Review[]>(reviewQuery, {
          productId: data._id,
        });
        setReviews(productReviews);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [productSlug]);

  if (loading) return <Loading />;
  if (error || !product) return <Error error={error || "Product not found"} />;

  const isOutOfStock = product.isSoldOut || product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;
  const savings = product.discountPrice
    ? product.originalPrice - product.discountPrice
    : 0;

  return (
    <div className="pt-24 pb-20 bg-white max-w-7xl mx-auto">
      <div className=" mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/sale" className="hover:text-black transition-colors">
            Sale
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 pb-10">
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-4/5 bg-gray-50 overflow-hidden group">
              {product.images && product.images[activeImg] && (
                <Image
                  src={urlFor(product.images[activeImg].asset).url()}
                  alt={product.images[activeImg]?.alt || product.name}
                  width={800}
                  height={800}
                  className={`object-cover h-full w-full transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? "grayscale" : ""}`}
                  priority
                />
              )}

              {product.promotion !== "none" && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                  {product.promotion.replace("-", " ")}
                </span>
              )}

              {savings > 0 && !isOutOfStock && (
                <span className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                  Save PKR {savings.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`relative w-20 h-24 shrink-0 border-2 transition-all ${
                    activeImg === idx
                      ? "border-black"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={urlFor(img.asset).url()}
                    alt={img.alt || "Thumbnail"}
                    width={600}
                    height={600}
                    className="object-cover h-full w-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest">
              {product.category?.title}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-gray-900">
                PKR{" "}
                {(
                  product.discountPrice || product.originalPrice
                ).toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* STOCK BAR */}
            {!isOutOfStock && (
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-100 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-orange-700 flex items-center gap-2">
                    {isLowStock ? (
                      <Flame size={14} className="animate-bounce" />
                    ) : (
                      <Clock size={14} />
                    )}
                    {isLowStock ? "HURRY! ALMOST GONE" : "LIMITED PIECES LEFT"}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600">
                    {product.stockQuantity} IN STOCK
                  </span>
                </div>
                <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((product.stockQuantity / 10) * 100, 100)}%`,
                    }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-3 mb-8 border-y border-gray-100 py-6">
              {product.material && (
                <div className="flex text-sm gap-2">
                  <span className="w-24 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    Material
                  </span>
                  <span className="text-gray-900">{product.material}</span>
                </div>
              )}
              {product.occasions && product.occasions.length > 0 && (
                <div className="flex text-sm gap-2">
                  <span className="w-24 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    Occasion
                  </span>
                  <span className="text-gray-900">
                    {product.occasions.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col gap-3 mb-10">
              {/* Upper Row: Quantity and Wishlist for Mobile */}
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-center border border-gray-200 h-14 w-32 md:w-40 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex-1 flex justify-center items-center hover:bg-gray-50 h-full transition-colors border-r border-gray-100"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-12 text-center font-medium text-sm">
                    {qty}
                  </span>

                  <button
                    type="button"
                    disabled={qty >= product.stockQuantity}
                    onClick={() => setQty((q) => q + 1)}
                    className={`flex-1 flex justify-center items-center h-full transition-colors border-l border-gray-100 ${
                      qty >= product.stockQuantity
                        ? "text-gray-200 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Wishlist Button - Desktop par ye line ke aakhir mein hoga, mobile par yahan */}
                <button className="h-14 flex-1 md:flex-none md:w-14 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-sm group">
                  <Heart
                    size={20}
                    className="text-gray-400 group-hover:text-red-500 transition-colors"
                  />
                </button>
              </div>

              {/* Main Action Button */}
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, qty)}
                className={`w-full py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold transition-all rounded-sm
      ${
        isOutOfStock
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-black text-white hover:bg-gray-900 active:scale-[0.98] shadow-md"
      }`}
              >
                {isOutOfStock ? "Sold Out" : "Add to Shopping Bag"}
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              {/* Free Shipping */}
              <div className="flex items-start gap-3">
                <Truck size={24} className="mt-1 text-pearion-dark" />
                <div>
                  <span className="font-semibold text-pearion-dark block mb-1">
                    Free Shipping
                  </span>
                  <p>
                    On all orders over PKR 1,500. Delivered across Pakistan with
                    tracking included.
                  </p>
                </div>
              </div>

              {/* Return Policy */}
              <div className="flex items-start gap-3">
                <Shield size={24} className="mt-1 text-pearion-dark" />
                <div>
                  <span className="font-semibold text-pearion-dark block mb-1">
                    Return Policy
                  </span>
                  <p>2–3 days return warranty.</p>
                  <p className="mt-1 text-gray-500 text-xs">
                    Change of mind is not applicable.
                  </p>
                </div>
              </div>

              {/* Online Payment */}
              <div className="flex items-start gap-3">
                <span className="mt-1 text-pearion-dark">
                  <FaCcMastercard
                    size={30}
                    className="mt-1 text-pearion-dark"
                  />
                </span>
                <div>
                  <span className="font-semibold text-pearion-dark block mb-1">
                    Online Payment
                  </span>
                  <p>
                    Pay instantly through EasyPaisa or other supported online
                    gateways.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {reviews.length > 0 ? (
          <div className="border-t py-8">
            <h2 className="font-serif text-2xl mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-gray-50 rounded shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {review.name}
                    </span>
                    <span className="text-yellow-400 text-sm">
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.text}</p>
                  <span className="text-gray-400 text-xs mt-1 block">
                    {new Date(review._createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-300 pt-8">
            <h2 className="font-serif text-2xl mb-6">Customer Reviews</h2>
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        )}
        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="font-serif text-3xl mb-12 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <SaleProductCard key={p._id} saleProduct={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleDetailPage;
