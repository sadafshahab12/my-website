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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product);
  };

  const renderTitle = () => {
    if (!highlight) return product.name;

    const regex = new RegExp(
      `(${highlight.trim().split(/\s+/).join("|")})`,
      "gi"
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
      )
    );
  };

  // Safely get the first image URL
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
          {product.promotion === "new" && (
            <span className="px-2 py-1 text-xs bg-black text-white rounded">
              New
            </span>
          )}

          {product.promotion === "bestseller" && (
            <span className="px-2 py-1 text-xs bg-gold text-white rounded">
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
        <p className="text-sm text-gray-500 mt-1">
          PKR {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
