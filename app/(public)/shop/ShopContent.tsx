// @ts-nocheck
// Legacy catalog content retained for compatibility.
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { GET_PRODUCTS, GET_CATEGORIES } from "@/app/gql/Product";
import { Product } from "@/app/types/productTypes";
import ProductCard from "../product/ProductCard";
import ProductFilters, { FilterValues } from "./ProductFilters";

interface ShopContentProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShopContent: React.FC<ShopContentProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      isNew: searchParams.get("isNew") === "true" || undefined,
      isFeatured: searchParams.get("isFeatured") === "true" || undefined,
      isTrending: searchParams.get("isTrending") === "true" || undefined,
      isBestSeller: searchParams.get("isBestSeller") === "true" || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      phase: searchParams.get("phase") || undefined,
      meterDisplayType: searchParams.get("meterDisplayType") || undefined,
    }),
    [searchParams],
  );

  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const pageSize = 12;

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  const { loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { first: 10, skip: 0, filters },
    fetchPolicy: "no-cache",
    onError: (err) => {
      console.error("Error fetching products:", err);
    },
  });

  useEffect(() => {
    if (!data?.products) return;
    setDisplayedProducts(data.products.products);
    setHasMore(data.products.hasMore);
    setSkip(0);
    setIsFetchingMore(false);
  }, [data]);

  useEffect(() => {
    setFilters(initialFilters);
    setDisplayedProducts([]);
    setSkip(0);
    setHasMore(true);
  }, [initialFilters]);

  const handleShowMore = () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    const newSkip = skip + pageSize;
    fetchMore({
      variables: { first: pageSize, skip: newSkip, filters },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const newProducts = fetchMoreResult.products.products;
        const newHasMore = fetchMoreResult.products.hasMore;

        setDisplayedProducts((prevProducts) => [
          ...prevProducts,
          ...newProducts,
        ]);
        setSkip(newSkip);
        setHasMore(newHasMore);
        setIsFetchingMore(false);

        return {
          products: {
            ...fetchMoreResult.products,
            products: [...prev.products.products, ...newProducts],
          },
        };
      },
    });
  };

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

    router.push(`/shop?${query.toString()}`);
  };

  const noProductsFound = displayedProducts.length === 0 && !loading && !error;

  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-6">
      <div className="hidden w-full shrink-0 md:block md:max-w-[300px] xl:max-w-[320px]">
        <ProductFilters
          initialFilters={initialFilters}
          onFilterChange={updateFilters}
          categories={categories}
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[88vw] max-w-md bg-white"
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

      <div className="min-w-0 flex-grow">
        {loading && !displayedProducts.length && (
          <div className="text-center py-12">
            <Package
              size={48}
              className="mx-auto text-gray-400 mb-4 animate-pulse"
            />
            <p className="text-lg text-gray-600">Loading catalog items...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Error loading catalog</p>
            <p className="text-sm text-gray-500">
              Please try again or adjust your filters.
            </p>
          </div>
        )}

        {noProductsFound && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2">No catalog items found</p>
            <p className="text-gray-500">Try adjusting technical filters</p>
          </div>
        )}

        {!noProductsFound && (
          <>
            <div className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-6">
              {displayedProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleShowMore}
                  disabled={isFetchingMore}
                  className={`rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-gray-800 ${
                    isFetchingMore ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isFetchingMore ? "Loading..." : "Show More Catalog Items"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopContent;
