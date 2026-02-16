import React from "react";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  highlight?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  highlight = "",
}) => {
  const { addToCart } = useCart();
  const isNew = () => {
    if (product.promotion !== "new") return false;

    const createdDate = new Date(product._createdAt);
    const currentDate = new Date();

    const diffInDays =
      (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= 7;
  };
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart(product);
  };

  const renderTitle = () => {
    if (!highlight) return product.name;

    const regex = new RegExp(
      `(${highlight.trim().split(/\s+/).join("|")})`,
      "gi",
    );
    return product.name.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-pearion-goldlight text-pearion-dark px-0.5 rounded-sm"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const firstImage = product.images?.[0];
  const firstImageUrl = firstImage
    ? urlFor(firstImage).url()
    : "/placeholder.png";
  const altText = firstImage?.alt || product.name;
  const productSlug = product.slug?.current ?? "";
  return (
    <Link href={`/shop/${productSlug}`} className="group block h-full">
      <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-3/4">
        <Image
          src={firstImageUrl}
          alt={altText}
          width={1000}
          height={1000}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2 flex gap-1">
          {isNew() && (
            <span className="px-2 py-1 text-xs bg-black text-white rounded">
              New
            </span>
          )}

          {product.promotion === "bestseller" && (
            <span className="px-2 py-1 text-xs bg-gold text-white rounded bg-red-400">
              Best Seller
            </span>
          )}

          {product.promotion === "featured" && (
            <span className="px-2 py-1 text-xs bg-emerald-600 text-white rounded">
              Featured
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 bg-white text-pearion-dark p-3 rounded-full shadow-md translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pearion-gold hover:text-white"
          aria-label="Add to cart"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="text-center">
        <h3 className="font-serif text-sm sm:text-lg text-pearion-dark group-hover:text-pearion-gold transition-colors duration-300 px-2">
          {renderTitle()}
        </h3>
        <div className="mt-2 flex flex-col items-center gap-1">
          {/* Price Row */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Final Price */}
            <span className="text-lg font-bold text-gray-900">
              PKR{" "}
              {(
                product.discountPrice || product.originalPrice
              ).toLocaleString()}
            </span>

            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.discountPrice && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Save{" "}
              {Math.round(
                ((product.originalPrice - product.discountPrice) /
                  product.originalPrice) *
                  100,
              )}
              %
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
