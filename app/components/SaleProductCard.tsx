"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { SaleProduct } from "../types/saleType";
import { Flame, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";

interface SaleProductCardProps {
  saleProduct: SaleProduct;
}

const SaleProductCard: React.FC<SaleProductCardProps> = ({ saleProduct }) => {
  const { addToCart } = useCart();
  const isOutOfStock = saleProduct.isSoldOut || saleProduct.stockQuantity <= 0;
  const isLowStock =
    saleProduct.stockQuantity > 0 && saleProduct.stockQuantity <= 3;

  const discountPercent = saleProduct.discountPrice
    ? Math.round(
        ((saleProduct.originalPrice - saleProduct.discountPrice) /
          saleProduct.originalPrice) *
          100,
      )
    : null;
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(saleProduct);
  };
  return (
    <div className="group relative flex flex-col h-full bg-white transition-all duration-500 hover:shadow-xl rounded-lg overflow-hidden border border-gray-100">
      <Link
        href={`/sale/${saleProduct.slug.current}`}
        className="flex flex-col grow"
      >
        {/* Image Container */}
        <div className="relative aspect-4/5 overflow-hidden bg-gray-50">
          {saleProduct.images && saleProduct.images[0] && (
            <Image
              src={urlFor(saleProduct.images[0].asset).url()}
              alt={saleProduct.images[0].alt || saleProduct.name}
              width={800}
              height={800}
              className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-60" : ""}`}
            />
          )}

          {/* Badges Logic */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock ? (
              <span className="bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-1 animate-pulse shadow-lg">
                <Clock size={10} /> Only {saleProduct.stockQuantity} Left
              </span>
            ) : (
              saleProduct.showSaleBadge &&
              discountPercent && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-lg">
                  {discountPercent}% OFF
                </span>
              )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col grow text-center">
          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-pearion-gold transition-colors">
            {saleProduct.name}
          </h3>

          <div className="min-h-6 mb-2">
            {!isOutOfStock && isLowStock && (
              <p className="text-[10px] text-orange-600 font-bold flex items-center justify-center gap-1 italic uppercase tracking-tighter">
                <Flame size={12} fill="currentColor" /> Selling fast! One piece
                remaining
              </p>
            )}
            {!isOutOfStock && !isLowStock && saleProduct.stockQuantity < 10 && (
              <p className="text-[10px] text-gray-400 font-medium">
                Limited availability: {saleProduct.stockQuantity} in stock
              </p>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-3 italic">
            {saleProduct.material || "Handcrafted Jewelry"}
          </p>

          <div className="mt-auto flex items-center justify-center gap-3">
            {saleProduct.discountPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  PKR {saleProduct.discountPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  PKR {saleProduct.originalPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                PKR {saleProduct.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-md
            ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-black hover:shadow-lg"
            }`}
        >
          {isOutOfStock ? "Sold Out" : "Secure Your Piece"}
        </button>
      </div>
    </div>
  );
};

export default SaleProductCard;
