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
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: Product[] = await client.fetch(`*[_type == "product"]{
          _id,
          name,
          price,
          "category": category->{_id, title},
          images[]{ asset->{url}, alt }
        }`);

        setAllProducts(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Map(
            data
              .map((p) => p.category)
              .filter(Boolean)
              .map((cat) => [cat._id, cat])
          ).values()
        );

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    const toggleSearch = () => {
      if (isOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (!isOpen) {
        setQuery("");
        setResults([]);
      }
    };
    toggleSearch();
  }, [isOpen]);

  // Handle search input
  useEffect(() => {
    const searchQueryWithProduct = () => {
      if (query.length > 1 && allProducts.length > 0) {
        const matches = searchProducts(allProducts, query);
        setResults(matches.slice(0, 4));
      } else {
        setResults([]);
      }
    };
    searchQueryWithProduct();
  }, [query, allProducts]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      onClose();
    }
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
    <div className="fixed inset-0 z-70 bg-white/95 backdrop-blur-md animate-fadeIn flex flex-col">
      {/* Header / Close */}
      <div className="container mx-auto px-4 py-6 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-pearion-dark transition-colors rounded-full hover:bg-gray-100"
          aria-label="Close search"
        >
          <X size={28} />
        </button>
      </div>

      {/* Main Search Area */}
      <div className="flex-1 container mx-auto px-4 md:px-8 max-w-4xl flex flex-col pt-4 md:pt-16">
        <form onSubmit={handleSearchSubmit} className="relative mb-12">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for jewellery..."
            className="w-full bg-transparent border-b-2 border-gray-200 text-3xl md:text-5xl font-serif text-pearion-dark placeholder-gray-300 focus:outline-none focus:border-pearion-gold transition-colors pb-4"
          />
          <button
            type="submit"
            className="absolute right-0 bottom-4 text-pearion-dark hover:text-pearion-gold transition-colors"
          >
            <ArrowRight size={32} />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto pb-20">
          {/* Quick Suggestions */}
          {query.length > 1 && results.length > 0 && (
            <div className="animate-slideUp">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">
                Suggestions
              </h3>
              <div className="space-y-4">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      router.push(
                        `/shop?search=${encodeURIComponent(product.name)}`
                      );
                      onClose();
                    }}
                    className="flex items-center group cursor-pointer p-2 -mx-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                      {product.images?.[0]?.asset?.url ? (
                        <Image
                          src={urlFor(product.images[0]).url()}
                          alt={product.images[0].alt || product.name}
                          width={1000}
                          height={1000}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-serif text-lg text-pearion-dark group-hover:text-pearion-gold transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {product.category?.title}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSearchSubmit()}
                className="mt-6 text-sm font-semibold uppercase tracking-widest text-pearion-gold hover:text-pearion-dark transition-colors flex items-center gap-2"
              >
                View all results <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Trending / Default */}
          {query.length < 2 && (
            <div className="animate-fadeIn">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-2">
                <TrendingUp size={14} /> Trending Now
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Bridal Set",
                  "Gold Rings",
                  "Pearl Necklace",
                  "Gift for Her",
                  "Summer Collection",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      router.push(`/shop?search=${encodeURIComponent(term)}`);
                      onClose();
                    }}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-600 hover:bg-pearion-gold hover:text-white hover:border-pearion-gold transition-all duration-300"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Dynamic Categories */}
              <div className="mt-12">
                <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => {
                        router.push(
                          `/shop?category=${encodeURIComponent(cat.title)}`
                        );
                        onClose();
                      }}
                      className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <span className="font-serif text-lg">{cat.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {query.length > 1 && results.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-2">
             {`   We couldn't find matches for "${query}"`}
              </p>
              <button
                onClick={() => handleSearchSubmit()}
                className="text-pearion-gold underline"
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
