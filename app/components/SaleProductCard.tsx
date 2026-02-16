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
    <div className="group relative flex flex-col h-full bg-white transition-all duration-300 hover:shadow-md md:hover:shadow-xl rounded-md md:rounded-lg overflow-hidden border border-gray-100">
      <Link
        href={`/sale/${saleProduct.slug.current}`}
        className="flex flex-col grow"
      >
        {/* Image Container - Aspect ratio optimized for mobile */}
        <div className="relative aspect-3/4 md:aspect-4/5 overflow-hidden bg-gray-50">
          {saleProduct.images && saleProduct.images[0] && (
            <Image
              src={urlFor(saleProduct.images[0].asset).url()}
              alt={saleProduct.images[0].alt || saleProduct.name}
              width={600} // Reduced for performance
              height={750}
              className={`object-cover h-full w-full transition-transform duration-700 md:group-hover:scale-110 ${
                isOutOfStock ? "grayscale opacity-60" : ""
              }`}
              priority={false}
            />
          )}

          {/* Badges - Smaller on mobile */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5">
            {isOutOfStock ? (
              <span className="bg-black/80 backdrop-blur-sm text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 uppercase tracking-widest">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-orange-600 text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 uppercase tracking-widest flex items-center gap-1 animate-pulse shadow-lg">
                <Clock size={8} className="md:w-2.5 md:h-2.5" /> Only{" "}
                {saleProduct.stockQuantity} Left
              </span>
            ) : (
              saleProduct.showSaleBadge &&
              discountPercent && (
                <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 uppercase tracking-widest shadow-lg">
                  {discountPercent}% OFF
                </span>
              )
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 md:p-4 flex flex-col grow text-center">
          <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-1 line-clamp-2 md:line-clamp-none min-h-8 md:min-h-0 group-hover:text-pearion-gold transition-colors">
            {saleProduct.name}
          </h3>

          {/* Stock Alerts - Minimal on mobile */}
          <div className="min-h-3.5 md:min-h-6 mb-1 md:mb-2">
            {!isOutOfStock && isLowStock && (
              <p className="text-[8px] md:text-[10px] text-orange-600 font-bold flex items-center justify-center gap-1 italic uppercase tracking-tighter">
                <Flame
                  size={10}
                  className="md:w-3 md:h-3"
                  fill="currentColor"
                />{" "}
                Selling fast!
              </p>
            )}
          </div>

          <p className="hidden xs:block text-[9px] md:text-xs text-gray-400 mb-2 md:mb-3 italic line-clamp-1">
            {saleProduct.material || "Handcrafted Jewelry"}
          </p>

          {/* Pricing - Stacked on very small screens, row on desktop */}
          <div className="mt-auto flex flex-col xs:flex-row items-center justify-center gap-0.5 md:gap-3">
            {saleProduct.discountPrice ? (
              <>
                <span className="text-sm md:text-lg font-bold text-gray-900 leading-tight">
                  PKR {saleProduct.discountPrice.toLocaleString()}
                </span>
                <span className="text-[10px] md:text-sm text-gray-400 line-through">
                  PKR {saleProduct.originalPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm md:text-lg font-bold text-gray-900">
                PKR {saleProduct.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Button Section */}
      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <button
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          className={`w-full py-2 md:py-2.5 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all rounded-md
            ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white active:scale-95 md:hover:bg-black md:hover:shadow-lg"
            }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default SaleProductCard;
