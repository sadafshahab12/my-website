"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Truck,
  Gift,
  ShieldCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductCard from "./components/ProductCard";
import { client } from "@/sanity/lib/client";
import { Category, Product, Review } from "./types";
import Head from "next/head";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const nextReview = useCallback(() => {
    setCurrentReviewIndex((prev) =>
      reviews.length ? (prev === reviews.length - 1 ? 0 : prev + 1) : 0
    );
  }, [reviews]);

  // Auto-slide effect — only this one
  useEffect(() => {
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, [nextReview]);
  const prevReview = () => {
    setCurrentReviewIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      const MIN_LOADING_TIME = 800; // minimum time for loading in ms
      const startTime = Date.now();

      try {
        const productQuery = `*[_type == "product"]{
          _id,
          name,
          price,
          category,
          promotion,
          slug,
          "images": images[]{_key,_type,asset->{_id,url},alt} 
        }`;
        const reviewQuery = `*[_type == "review"]{
          _id,
          name,
          text,
          rating
        }`;
        const categoryQuery = `*[_type == "category"] | order(order asc){
          _id,
          title,
          slug,
          order,
          image{_key,_type,asset->{_id,url}, alt}
        }`;

        const [productData, reviewData, categoryData] = await Promise.all([
          client.fetch(productQuery),
          client.fetch(reviewQuery),
          client.fetch(categoryQuery),
        ]);

        // Calculate elapsed time
        const elapsed = Date.now() - startTime;
        const remainingTime = MIN_LOADING_TIME - elapsed;

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        setProducts(productData);
        setReviews(reviewData);
        setCategories(categoryData);
        setLoadingProducts(false);
        setLoadingCategories(false);
      } catch (err) {
        console.error("Sanity fetch error:", err);
        setLoadingProducts(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const bestSellers = products
    .filter((p) => p.promotion === "bestseller")
    .slice(0, 4);

  return (
    <>
      <Head>
        <title>Pearion Collections – Premium Pearl Jewelry</title>
        <meta
          name="description"
          content="Discover Pearion Collections: Elegant pearl jewelry designed for every occasion."
        />
      </Head>
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/website image/home/hero banner.png"
              alt="Luxury Jewellery"
              width={1000}
              height={1000}
              className="w-full h-full object-cover filter brightness-[0.5] sm:brightness-[0.8]"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center sm:items-end justify-center text-center sm:px-20 px-2">
            <h2 className="text-white text-center sm:text-end text-sm md:text-base tracking-[0.2em] uppercase mb-4 animate-fadeIn">
              Premium Collection
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-center sm:text-end  text-white mb-6 leading-tight animate-slideUp">
              Designed For You. <br /> Crafted To Shine.
            </h1>
            <p className="text-gray-200 text-[15px] sm:text-lg mb-8 max-w-xl font-light text-center sm:text-end ">
              {` "Timeless Jewelry for Women | Elegant Pieces for Every Occasion"
            Discover exquisite, timeless jewelry designed for the modern
            woman—perfect for work, celebrations, and everyday elegance.`}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href="/shop"
                className="bg-white text-pearion-dark px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-pearion-gold hover:text-white transition-all duration-300"
              >
                Shop New Arrivals
              </Link>
              <Link
                href="/shop"
                className="border border-white text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white hover:text-pearion-dark transition-all duration-300"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-serif text-center mb-12">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loadingCategories
                ? [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-lg"
                    />
                  ))
                : categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/shop?category=${category.slug.current}`}
                      className="group relative h-64 overflow-hidden"
                    >
                      {category.image && (
                        <Image
                          src={category.image.asset.url}
                          alt={category.image?.alt ?? category.title}
                          width={1000}
                          height={1000}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white font-serif text-xl tracking-wider border-b-2 border-transparent group-hover:border-white pb-1 transition-all">
                          {category.title}
                        </span>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-20 bg-pearion-cream">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-serif mb-2">Best Sellers</h2>
                <p className="text-gray-500">Loved by you, crafted by us.</p>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center text-sm uppercase tracking-wider font-semibold hover:text-pearion-gold transition-colors"
              >
                View All <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loadingProducts
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-100 bg-gray-200 animate-pulse rounded-lg"
                    />
                  ))
                : bestSellers.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link
                href="/shop"
                className="inline-flex items-center text-sm uppercase tracking-wider font-semibold border-b border-black pb-1"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="bg-pearion-cream p-4 rounded-full mb-6 text-pearion-gold">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-serif text-xl mb-3">Premium Craftsmanship</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Meticulously designed pearl jewelry with high-quality materials,
                ensuring lasting brilliance and elegance for your collection.
              </p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-pearion-cream p-4 rounded-full mb-6 text-pearion-gold">
                <Gift size={32} />
              </div>
              <h3 className="font-serif text-xl mb-3">Gift-Ready Packaging</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Every order of luxury pearl jewelry comes in our signature box,
                perfect as a gift for her or a special occasion.
              </p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-pearion-cream p-4 rounded-full mb-6 text-pearion-gold">
                <Truck size={32} />
              </div>
              <h3 className="font-serif text-xl mb-3">
                Fast & Secure Delivery
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                We ensure your premium pearl jewelry reaches you safely and
                quickly, anywhere in Pakistan.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-stone-950 text-white overflow-hidden relative">
          {/* Decorative Background Element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent to-stone-700" />

          <div className="container mx-auto px-6 max-w-4xl pt-12">
            <header className="text-center mb-16">
              <span className="text-pearion-gold uppercase tracking-[0.3em] text-xs mb-4 block">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-serif italic">
                Voices of Elegance
              </h2>
            </header>

            {reviews.length > 0 ? (
              <div className="relative group">
                {/* The Quote Icon - Adds a designer touch */}
                <Quote className="absolute -top-8 -left-4 text-white/10 w-20 h-20 z-0" />

                <div className="relative z-10 text-center px-12">
                  {/* Star Rating */}
                  <div className="flex justify-center gap-1 mb-8 text-pearion-gold/80">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="currentColor"
                        className="opacity-80"
                      />
                    ))}
                  </div>

                  {/* Review Text with Transition Container */}
                  <div className="min-h-50 flex flex-col justify-center">
                    <p className="text-xl md:text-2xl leading-relaxed italic mb-10 text-stone-200 transition-all duration-700 ease-in-out">
                      {` "${reviews[currentReviewIndex].text}"`}
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px w-8 bg-pearion-gold/50" />
                      <p className="text-sm uppercase tracking-[0.2em] text-stone-400 font-light">
                        {reviews[currentReviewIndex].name}
                      </p>
                      <div className="h-px w-8 bg-pearion-gold/50" />
                    </div>
                  </div>
                </div>

                {/* Refined Navigation - Moved to sides with low-opacity hover states */}
                <button
                  onClick={prevReview}
                  className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-3 text-white/30 hover:text-white transition-colors duration-300"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={32} strokeWidth={1} />
                </button>

                <button
                  onClick={nextReview}
                  className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-3 text-white/30 hover:text-white transition-colors duration-300"
                  aria-label="Next review"
                >
                  <ChevronRight size={32} strokeWidth={1} />
                </button>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-12">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentReviewIndex(i)}
                      className={`h-1 transition-all duration-500 rounded-full ${
                        i === currentReviewIndex
                          ? "w-8 bg-pearion-gold"
                          : "w-2 bg-stone-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-stone-500">No reviews yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
