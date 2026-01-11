"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { searchProducts } from "../utils/searchHelper";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { client } from "@/sanity/lib/client";

import Loading from "./loading";
import Error from "../error";

const ShopPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("all");
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null); // reset previous errors

      const start = Date.now();

      const query = `*[_type == "product"]{
  _id,
  _createdAt,
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
  colors,
  occasions,
  tags,
  careInstructions,
  promotion,
  slug,
  images[]{
    asset,
    alt
  }
}`;

      const data: Product[] = await client.fetch(query);
      setDbProducts(data);

      const elapsed = Date.now() - start;
      const minLoadingTime = 1500;
      if (elapsed < minLoadingTime) {
        setTimeout(() => setIsLoading(false), minLoadingTime - elapsed);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Sanity fetch error:", err);
      setError(
        "Oops! Something went wrong. Please check your internet connection and try again."
      );
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync Category with URL
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Derived Filter Options
  // const categories = ["All", "Necklaces", "Earrings", "Bracelets", "Rings"];
  // Derived Filter Options
  const categories = useMemo(() => {
    const uniqueCats = Array.from(
      new Set(dbProducts.map((p) => p.category?.title).filter(Boolean))
    );
    return ["All", ...uniqueCats];
  }, [dbProducts]);

  const materials = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(dbProducts.flatMap((p) => p.material?.split(" / ") || []))
      ),
    ],
    [dbProducts]
  );

  const colors = useMemo(
    () => [
      "All",
      ...Array.from(new Set(dbProducts.flatMap((p) => p.colors || []))),
    ],
    [dbProducts]
  );

  // Filtering and Sorting Logic
  const processedProducts = useMemo(() => {
    let list: Product[] = [...dbProducts];

    // Apply search first
    if (searchQuery) {
      list = searchProducts(list, searchQuery);
    }

    // Apply filters
    list = list.filter((product) => {
      const categoryMatch =
        selectedCategory.toLowerCase() === "all" ||
        product.category?.title.toLowerCase() ===
          selectedCategory.toLowerCase();

      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const materialMatch =
        selectedMaterial === "All" ||
        product.material?.includes(selectedMaterial);

      const colorMatch =
        selectedColor === "All" || product.colors?.includes(selectedColor);

      return categoryMatch && priceMatch && materialMatch && colorMatch;
    });

    // Sorting
    if (sortBy === "featured") {
      list = list.filter((p) => p.promotion === "featured");
    } else if (sortBy === "newest") {
      list = list.sort(
        (a, b) =>
          new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
      );
    } else if (sortBy === "bestseller") {
      list = list.filter((p) => p.promotion === "bestseller");
    } else if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [
    dbProducts,
    searchQuery,
    selectedCategory,
    priceRange,
    selectedMaterial,
    selectedColor,
    sortBy,
  ]);

  const clearFilters = (): void => {
    setSelectedCategory("All");
    setSelectedMaterial("All");
    setSelectedColor("All");
    setPriceRange([0, 50000]);
    router.push(pathname);
  };
  const clearSearch = () => {
    setSelectedCategory("All");
    setSelectedMaterial("All");
    setSelectedColor("All");
    setPriceRange([0, 50000]);
    setSortBy("all");
    router.push("/shop"); // Reset URL and search query
  };
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        {/* Use ErrorPage component */}
        <Error error={error} reset={() => fetchProducts()} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          {searchQuery ? (
            <>
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                Search Results for
              </p>
              <h1 className="text-3xl md:text-4xl font-serif">
                {`"${searchQuery}"`}
              </h1>
              <button
                onClick={() => clearSearch()}
                className="text-pearion-gold underline mt-2 block mx-auto text-sm cursor-pointer"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-serif mb-4">The Collection</h1>
              <p className="text-gray-500 max-w-md mx-auto">
                Handcrafted jewelry designed to elevate your style.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Sidebar */}
          <aside
            className={`lg:w-1/4 ${isFilterOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="sticky top-24 space-y-8 bg-white p-6 lg:p-4 rounded-xl shadow-lg border border-gray-100 z-40">
              {/* Mobile Header */}
              <div className="lg:hidden flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-serif text-xl font-semibold">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-pearion-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-serif text-lg mb-4 border-b pb-2 font-semibold">
                  Category
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left text-sm transition-all px-3 py-2 rounded-md ${
                          selectedCategory === cat
                            ? "bg-pearion-gold text-white font-semibold shadow-inner"
                            : "text-gray-600 hover:text-pearion-dark hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-serif text-lg mb-4 border-b pb-2 font-semibold">
                  Price
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>PKR 0</span>
                  <span>PKR {priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="200"
                  value={priceRange[1]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPriceRange([0, parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pearion-gold hover:accent-pearion-dark transition-colors"
                />
              </div>

              {/* Material Filter */}
              <div>
                <h3 className="font-serif text-lg mb-4 border-b pb-2 font-semibold">
                  Material
                </h3>
                <select
                  value={selectedMaterial}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedMaterial(e.target.value)
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-pearion-gold focus:outline-none focus:ring-1 focus:ring-pearion-gold transition"
                >
                  {materials.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <h3 className="font-serif text-lg mb-4 border-b pb-2 font-semibold">
                  Color
                </h3>
                <select
                  value={selectedColor}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedColor(e.target.value)
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-pearion-gold focus:outline-none focus:ring-1 focus:ring-pearion-gold transition"
                >
                  {colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <span className="text-gray-500 text-sm">
                {processedProducts.length} Results
              </span>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center justify-center space-x-2 border border-gray-300 px-4 py-3 flex-1"
                >
                  <Filter size={14} />
                  <span>Filter</span>
                </button>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSortBy(e.target.value)
                    }
                    className="w-full sm:w-48 appearance-none border border-gray-300 px-4 py-3 text-xs font-bold tracking-widest"
                  >
                    <option value="all">All</option>
                    <option value="featured">Featured</option>
                    <option value="newest">New Arrivals</option>
                    <option value="bestseller">Best Sellers</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {processedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {processedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    highlight={searchQuery}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-serif text-2xl mb-4">
                  No matches for{` "${searchQuery || "filters"}"`}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-pearion-gold border-b border-pearion-gold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
