// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Filter } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import ProductCard from "../product/ProductCard";
import MainLayout from "@/app/components/templates/MainLayout";
import ProductFilters, { FilterValues } from "./ProductFilters";
import { useCatalogCategories } from "@/app/hooks/catalog/useCatalogCategories";
import { useShopProducts } from "@/app/hooks/catalog/useShopProducts";

const ShopPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();

  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParamString);

    return {
      search: params.get("search") || "",
      isNew: params.get("isNew") === "true" || undefined,
      isFeatured: params.get("isFeatured") === "true" || undefined,
      isTrending: params.get("isTrending") === "true" || undefined,
      isBestSeller: params.get("isBestSeller") === "true" || undefined,
      minPrice: params.get("minPrice")
        ? parseFloat(params.get("minPrice")!)
        : undefined,
      maxPrice: params.get("maxPrice")
        ? parseFloat(params.get("maxPrice")!)
        : undefined,
      categoryId: params.get("categoryId") || undefined,
      phase: params.get("phase") || undefined,
      meterDisplayType: params.get("meterDisplayType") || undefined,
    };
  }, [searchParamString]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const { categories } = useCatalogCategories();
  const {
    displayedProducts,
    loading,
    error,
    totalCount,
    hasLoaded,
    hasMore,
    isFetchingMore,
    handleShowMore,
    isDemoCatalog,
  } = useShopProducts(filters);

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== false,
  ).length;

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const updateFilters = (newFilters: FilterValues) => {
    const query = new URLSearchParams();
    if (newFilters.search) query.set("search", newFilters.search);
    if (newFilters.isNew) query.set("isNew", "true");
    if (newFilters.isFeatured) query.set("isFeatured", "true");
    if (newFilters.isTrending) query.set("isTrending", "true");
    if (newFilters.isBestSeller) query.set("isBestSeller", "true");
    if (newFilters.minPrice)
      query.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice)
      query.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.categoryId) query.set("categoryId", newFilters.categoryId);
    if (newFilters.phase) query.set("phase", newFilters.phase);
    if (newFilters.meterDisplayType)
      query.set("meterDisplayType", newFilters.meterDisplayType);

    const queryString = query.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop");
  };

  const handleReset = () => {
    router.push("/shop");
  };

  const noProductsFound =
    hasLoaded && displayedProducts.length === 0 && !loading && !error;
  const catalogCountText =
    loading && displayedProducts.length === 0
      ? "Loading catalog items..."
      : `${totalCount} catalog items available for enquiry`;

  return (
    <MainLayout isDemoCatalog={isDemoCatalog}>
      <div className="min-h-screen">
        <div className="sticky top-[60px] z-30 border-b border-slate-100 bg-white/95 backdrop-blur sm:top-[64px] lg:top-[68px]">
          <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  Product Catalog
                </h1>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  {catalogCountText}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setFiltersVisible(!filtersVisible)}
                  className="hidden items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-gray-800 lg:flex"
                >
                  <Filter size={18} />
                  <span className="font-medium">
                    {filtersVisible ? "Hide" : "Show"} Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white/20 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-gray-800 lg:hidden"
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white/20 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-6 xl:gap-8">
            <AnimatePresence>
              {filtersVisible && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    duration: 0.3,
                  }}
                  className="hidden shrink-0 self-start overflow-y-auto lg:sticky lg:top-[176px] lg:block lg:max-h-[calc(100vh-192px)]"
                >
                  <div className="w-[300px] xl:w-[320px] 2xl:w-[340px]">
                    <ProductFilters
                      initialFilters={initialFilters}
                      onFilterChange={updateFilters}
                      categories={categories}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[90] bg-black/50 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-full w-[90vw] max-w-sm bg-white shadow-2xl"
                  >
                    <ProductFilters
                      initialFilters={initialFilters}
                      onFilterChange={updateFilters}
                      categories={categories}
                      isMobile={true}
                      onCloseMobile={() => setSidebarOpen(false)}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="min-w-0 flex-1"
              layout
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
            >
              {loading && !displayedProducts.length && (
                <div className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-6 lg:gap-8">
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-sm animate-pulse sm:rounded-[24px] lg:rounded-[28px]"
                    >
                      <div className="h-48 bg-gray-200 sm:h-56 lg:h-64"></div>
                      <div className="space-y-3 p-4 lg:p-5">
                        <div className="h-4 rounded bg-gray-200 lg:h-5"></div>
                        <div className="h-4 w-2/3 rounded bg-gray-200 lg:h-5"></div>
                        <div className="h-6 w-1/2 rounded bg-gray-200 lg:h-7"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Error loading catalog
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please try again or adjust your filters.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {noProductsFound && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No catalog items found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting technical filters or search terms.
                  </p>
                  <button
                    onClick={handleReset}
                    className="rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {!noProductsFound && !loading && (
                <>
                  <div className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-6 lg:gap-8">
                    {displayedProducts.map(
                      (product: Product, index: number) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ProductCard product={product} index={index} />
                        </motion.div>
                      ),
                    )}
                  </div>

                  {hasMore && (
                    <div className="mt-12 text-center">
                      {isFetchingMore ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                          <span className="text-gray-600">
                            Loading more catalog items...
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={handleShowMore}
                          disabled={isFetchingMore}
                          className="rounded-xl bg-black px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-xl"
                        >
                          Load More Catalog Items
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
