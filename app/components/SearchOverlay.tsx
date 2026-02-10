"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Product, Category } from "../types";
import { searchProducts } from "../utils/searchHelper";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trendingItems, setTrendingItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 1. Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 2. Fetch Data (Slug included for Trending)
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const data = await client.fetch(`{
          "all": *[_type == "product"]{
            _id,
            name,
            price,
            slug,
            "category": category->{_id, title, slug},
            images[]{ asset->{url}, alt }
          },
          "trending": *[_type == "product" && isTrending == true][0...6]{
            _id,
            name,
            slug
          }
        }`);

        setAllProducts(data.all);
        setTrendingItems(data.trending);

        const uniqueCategories = Array.from(
          new Map(
            data.all
              .map((p: Product) => p.category)
              .filter(Boolean)
              .map((cat: Category) => [cat._id, cat]),
          ).values(),
        );
        setCategories(uniqueCategories as Category[]);
      } catch (err) {
        console.error("Error fetching search data:", err);
      }
    };
    fetchSearchData();
  }, []);

  // 3. Focus & Reset
  useEffect(() => {
    const toggleMenu = () => {
      if (isOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (!isOpen) {
        setQuery("");
        setResults([]);
      }
    };
    toggleMenu();
  }, [isOpen]);

  // 4. Live Search Logic
  useEffect(() => {
    const searchQuery = () => {
      if (query.length > 1 && allProducts.length > 0) {
        const matches = searchProducts(allProducts, query);
        setResults(matches.slice(0, 4));
      } else {
        setResults([]);
      }
    };
    searchQuery();
  }, [query, allProducts]);

  // General search submit (Shop page)
  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (finalQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(finalQuery)}`);
      onClose();
    }
  };

  const navigateToProduct = (slug: string) => {
    router.push(`/shop/${slug}`);
    onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-white/98 backdrop-blur-md animate-fadeIn flex flex-col h-screen w-full">
      {/* Header */}
      <div className="w-full px-4 py-4 md:py-6 flex justify-end shrink-0">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-pearion-dark transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={24} className="md:w-7 md:h-7" />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden container mx-auto px-4 md:px-8 max-w-5xl">
        {/* Search Input Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative mb-6 md:mb-10 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jewellery..."
            className="w-full bg-transparent border-b border-gray-200 text-2xl md:text-5xl font-serif text-pearion-dark placeholder-gray-300 focus:outline-none focus:border-pearion-gold transition-colors pb-3 md:pb-6 pr-10"
          />
          <button
            type="submit"
            className="absolute right-0 bottom-3 md:bottom-6 text-pearion-dark hover:text-pearion-gold transition-colors"
          >
            <ArrowRight size={24} className="md:w-8 md:h-8" />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
          {/* 1. Live Results Suggestions - Ab ye seedha product page pe jayeinge */}
          {query.length > 1 && results.length > 0 && (
            <div className="animate-slideUp">
              <h3 className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 md:mb-6">
                Suggestions
              </h3>
              <div className="grid grid-cols-1 gap-2 md:gap-4">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigateToProduct(product.slug.current)}
                    className="flex items-center group cursor-pointer p-2 md:p-3 -mx-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {product.images?.[0]?.asset?.url ? (
                        <Image
                          src={urlFor(product.images[0]).url()}
                          alt={product.images[0].alt || product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="ml-3 md:ml-4 flex-1 min-w-0">
                      <h4 className="font-serif text-base md:text-xl text-pearion-dark truncate group-hover:text-pearion-gold transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">
                        {product.category?.title}
                      </p>
                    </div>
                    <div className="text-sm md:text-base font-medium text-gray-900 ml-2">
                      PKR {product.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Dynamic Trending & Categories */}
          {query.length < 2 && (
            <div className="animate-fadeIn space-y-8 md:space-y-12">
              {/* CLEAN URL TRENDING BUTTONS */}
              {trendingItems.length > 0 && (
                <div>
                  <h3 className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <TrendingUp size={14} /> Trending Now
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {trendingItems.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => navigateToProduct(item.slug.current)}
                        className="px-3 py-1.5 md:px-5 md:py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs md:text-sm text-gray-600 hover:bg-pearion-gold hover:text-white hover:border-pearion-gold transition-all duration-300 shadow-sm"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div>
                <h3 className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => {
                        router.push(
                          `/shop?category=${encodeURIComponent(cat.slug.current)}`,
                        );
                        onClose();
                      }}
                      className="aspect-4/3 md:aspect-video bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white hover:border-pearion-gold hover:shadow-lg hover:shadow-pearion-gold/5 transition-all group"
                    >
                      <span className="font-serif text-sm md:text-lg text-gray-700 group-hover:text-pearion-gold">
                        {cat.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. No results */}
          {query.length > 1 && results.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <p className="text-gray-500 mb-3 text-sm md:text-base">
                {`We couldn't find matches for "${query}"`}
              </p>
              <button
                onClick={() => handleSearchSubmit()}
                className="text-pearion-gold font-medium underline underline-offset-4"
              >
                Search all products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
