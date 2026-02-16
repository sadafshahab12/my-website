"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, ShoppingBag, Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import Error from "../error";
import Loading from "../shop/loading";
import { SaleHero, SaleProduct } from "../types/saleType";
import SaleProductCard from "../components/SaleProductCard";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const SalePage: React.FC = () => {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<SaleHero | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("low-to-high");
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const query = `*[_type == "sale" && status == "live" && defined(discountPrice)] | order(discountPrice asc){
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
      const heroQuery = `*[_type == "saleHero"][0]{
  _id,
  _type,
  eventLabel,
  mainTitle,
  highlightWord,
  subTitle,
  isActive,
  "backgroundImage": backgroundImage.asset->url
}`;

      const [productRes, heroRes] = await Promise.all([
        client.fetch<SaleProduct[]>(query),
        client.fetch<SaleHero>(heroQuery),
      ]);

      setProducts(productRes);
      setHeroData(heroRes);
    } catch (err) {
      console.log(err);
      setError("Failed to load the sale collection.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  useEffect(() => {
    fetchData();
  }, []);
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      const priceA = a.discountPrice ?? 0;
      const priceB = b.discountPrice ?? 0;

      if (sortBy === "low-to-high") {
        return priceA - priceB;
      }
      if (sortBy === "high-to-low") {
        return priceB - priceA;
      }
      return 0;
    });
  }, [searchQuery, products, sortBy]);
  const filteredResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, products]);
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} reset={fetchData} />;

  const renderTitle = () => {
    if (!heroData) return "Our Exclusive Sale";
    if (!heroData.highlightWord) return heroData.mainTitle;

    const parts = heroData.mainTitle.split(
      new RegExp(`(${heroData.highlightWord})`, "gi"),
    );
    return parts.map((part, i) =>
      part.toLowerCase() === heroData.highlightWord.toLowerCase() ? (
        <span
          key={i}
          className="relative inline-block italic text-[#D4AF37] font-serif px-1"
        >
          {part}
          <svg
            className="absolute -bottom-1 left-0 w-full h-2 text-[#D4AF37]/30"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 5 Q 25 0, 50 5 T 100 5"
              stroke="currentColor"
              fill="transparent"
              strokeWidth="4"
            />
          </svg>
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900">
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#FDFCFB]">
        {heroData?.backgroundImage && (
          <div className="absolute inset-1 top-18 z-0">
            <motion.img
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.75 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={heroData.backgroundImage}
              alt="Sale Background"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" mx-auto text-center relative z-10 px-6"
        >
          {/* Event Label (Badge) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] md:text-xs font-bold uppercase mb-6 tracking-widest">
            <Sparkles size={14} className="animate-pulse" />
            {heroData?.eventLabel || "Limited Edition"}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-6 leading-[1.1] max-w-5xl mx-auto drop-shadow-sm">
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-gray-600 text-base md:text-lg mb-8 font-light leading-relaxed">
            {heroData?.subTitle ||
              "Elevate your style with our premium handcrafted jewelry, now at exceptional prices."}
          </p>
        </motion.div>
      </section>

      <section className=" mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-2xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jhumkis, category..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-12 rounded-xl outline-none text-gray-700 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showDropdown && filteredResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3">
                    Quick Results
                  </p>
                </div>
                {filteredResults.map((item) => (
                  <Link
                    key={item._id}
                    href={`/sale/${item.slug.current}`}
                    className="flex items-center gap-4 p-3 hover:bg-[#D4AF37]/5 transition-colors group"
                  >
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={urlFor(item.images[0].asset).url()}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-serif font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#D4AF37] font-bold">
                        PKR {item.discountPrice?.toLocaleString()}
                      </p>
                    </div>
                    <Sparkles
                      size={14}
                      className="text-gray-200 group-hover:text-[#D4AF37] transition-colors"
                    />
                  </Link>
                ))}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 border-t border-gray-50"
                >
                  Close Results
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className=" mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-serif text-gray-800 flex items-center gap-3">
              {searchQuery ? "Search Results" : "Collection Highlights"}
              <span className="hidden md:block h-px w-12 bg-[#D4AF37]/30" />
            </h2>
            <p className="text-gray-400 flex items-center gap-2 text-sm italic font-light">
              <ShoppingBag size={14} />
              {filteredProducts.length} exquisite pieces discovered
            </p>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all duration-300 cursor-pointer group">
              <Filter size={14} className="text-[#D4AF37]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
                Sort By:
                <span className="text-gray-900 ml-1">
                  {sortBy === "low-to-high"
                    ? "Price Low-High"
                    : "Price High-Low"}
                </span>
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>

              {/* Animated Chevron Arrow */}
              <motion.svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className="text-gray-400 group-hover:text-[#D4AF37] transition-colors"
                animate={{ rotate: 0 }}
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>

            {/* Visual Hover Effect Underline */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-[#D4AF37]/20 rounded-full"
              initial={{ width: 0 }}
              whileHover={{ width: "80%" }}
            />
          </div>
        </div>

        {/* PRODUCT GRID - Optimized for Mobile (2 Columns) */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16"
            >
              {filteredProducts.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <SaleProductCard saleProduct={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* EMPTY STATE */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 px-6 border-2 border-dashed border-gray-100 rounded-4xl bg-white/50"
            >
              <div className="bg-white shadow-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 border border-gray-50">
                <Search className="text-[#D4AF37]" size={32} />
              </div>
              <h3 className="text-gray-800 font-serif text-2xl mb-2">
                No matching pieces
              </h3>
              <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed mb-8">
                {`We couldn't find any results for "${searchQuery}". Try a
                different style or browse our curated collection.`}
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-8 py-3 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300 shadow-lg"
              >
                Show All Products
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SalePage;
