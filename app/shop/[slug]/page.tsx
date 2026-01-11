"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Minus, Plus, Heart, Truck, Shield } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Product } from "@/app/types";
import { useCart } from "@/app/context/CartContext";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import Loading from "../loading";
import Error from "@/app/error";

export type Review = {
  _id: string;
  name: string;
  text: string;
  rating: number;
  _createdAt: string;
};

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productSlug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
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

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch product
        const query = `*[_type=="product" && slug.current == $slug][0]{
          _id,
          name,
          description,
          price,
          size,
          material,
          category->{
              _id,
              title,
              slug
            },
          promotion,
          careInstructions,
          colors,
          images[]{_key,_type,asset->{_id,url}, alt},
          slug
        }`;

        const data = await client.fetch<Product>(query, { slug: productSlug });
        if (!data) {
          setError("The product you are looking for could not be found.");
          setLoading(false);
          router.push("/shop");
          return;
        }
        setProduct(data);

        // Fetch related products
        const relatedQuery = `*[
  _type=="product" &&
  category._ref == $categoryId &&
  slug.current != $slug
] | order(_createdAt desc)[0..3]{
  _id,
  name,
  price,
  promotion,
  images[]{_key,_type,asset->{_id,url}, alt},
  slug
}`;

        const relatedData = await client.fetch<Product[]>(relatedQuery, {
          categoryId: data.category._id,
          slug: productSlug,
        });

        setRelatedProducts(relatedData);

        // Fetch reviews
        const reviewQuery = `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
          _id,
          name,
          text,
          rating,
          _createdAt
        }`;
        const productReviews = await client.fetch<Review[]>(reviewQuery, {
          productId: data._id,
        });
        setReviews(productReviews);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          "Unable to load product details. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, router]);

  if (loading || !product) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        {/* Use ErrorPage component */}
        <Error error={error} />
      </div>
    );
  }

  const gallery = product.images.length > 0 ? product.images : [];
  const mainImage = gallery[activeImg];
  const mainImageUrl = mainImage ? urlFor(mainImage).url() : "/placeholder.png";
  const mainImageAlt = mainImage?.alt || product.name;

  return (
    <div className="pt-24 pb-20 bg-white max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-pearion-dark">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="hover:text-pearion-dark mx-2">
            Shop
          </Link>{" "}
          / <span className="text-pearion-dark">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-4/5 bg-gray-100 overflow-hidden cursor-zoom-in group relative">
              <Image
                src={mainImageUrl}
                alt={mainImageAlt}
                width={1000}
                height={1000}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 origin-center"
              />
              {product.promotion === "new" && (
                <span className="absolute top-4 left-4 bg-pearion-dark text-white text-xs px-3 py-1 uppercase tracking-widest">
                  New In
                </span>
              )}

              {product.promotion === "bestseller" && (
                <span className="absolute top-4 left-4 bg-pearion-gold text-white text-xs px-3 py-1 uppercase tracking-widest">
                  Best Seller
                </span>
              )}

              {product.promotion === "featured" && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs px-3 py-1 uppercase tracking-widest">
                  Featured
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              {gallery.map((img, idx) => {
                const thumbUrl = img.asset.url;
                const thumbAlt =
                  img.alt || `${product.name} thumbnail ${idx + 1}`;
                return (
                  <button
                    key={img._key}
                    onClick={() => setActiveImg(idx)}
                    className={`w-20 h-24 bg-gray-100 overflow-hidden border-2 transition-colors ${
                      activeImg === idx
                        ? "border-pearion-dark"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={thumbAlt}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif font-black text-3xl md:text-4xl text-pearion-dark mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-gray-900 font-medium mb-6">
              PKR {product.price.toLocaleString()}.00
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              {/* Material */}
              {product.material && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-24 font-semibold text-pearion-dark uppercase text-xs tracking-wider">
                    Material
                  </span>
                  <span>{product.material}</span>
                </div>
              )}

              {/* Size */}
              {product.size && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-24 font-semibold text-pearion-dark uppercase text-xs tracking-wider">
                    Size
                  </span>
                  <span>{product.size}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-300 w-full sm:w-32 justify-between px-4 py-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="text-gray-500 hover:text-black"
                >
                  <Minus size={16} />
                </button>
                <span className="font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="text-gray-500 hover:text-black"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 bg-pearion-dark text-white py-3 px-8 uppercase tracking-widest text-sm font-semibold hover:bg-pearion-gold transition-colors duration-300 cursor-pointer"
              >
                Add to Cart
              </button>
              <button className="border border-gray-300 flex justify-center items-center p-3 hover:border-pearion-gold hover:text-pearion-gold transition-colors text-gray-500">
                <Heart size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-8">
              <div className="flex items-start gap-3">
                <Truck size={20} className="mt-1 text-pearion-dark" />
                <div>
                  <span className="font-semibold text-pearion-dark">
                    Free Shipping
                  </span>
                  <p>
                    On all orders over PKR 5,000. Delivered across Pakistan with
                    tracking included.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield size={20} className="mt-1 text-pearion-dark" />
                <div>
                  <span className="font-semibold text-pearion-dark">
                    1-Year Warranty
                  </span>
                  <p>
                    Covers manufacturing defects like loose clasps, broken
                    chains, or detached pearls/stones. Wear-and-tear or
                    accidental damage not included.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mb-12">
              <h4 className="font-serif text-lg mb-2">Care Instructions</h4>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                {product.careInstructions?.map((ci, idx) => (
                  <li key={idx}>{ci}</li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            {reviews.length > 0 ? (
              <div className="border-t pt-8">
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
              <div className="border-t pt-8">
                <h2 className="font-serif text-2xl mb-6">Customer Reviews</h2>
                <p className="text-gray-500">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
