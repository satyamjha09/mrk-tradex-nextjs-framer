// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Filter, Search } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import ProductCard from "../product/ProductCard";
import MainLayout from "@/app/components/templates/MainLayout";
import ProductFilters, { FilterValues } from "./ProductFilters";
import { useCatalogCategories } from "@/app/hooks/catalog/useCatalogCategories";
import { useShopProducts } from "@/app/hooks/catalog/useShopProducts";
import {
  CATALOG_GROUPS,
  findCategoryForGroup,
  getGroupByKey,
  getSeries,
  getSeriesMatchTokens,
} from "@/app/data/catalog/series";

const ShopPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();

  const { categories, loading: categoriesLoading } = useCatalogCategories();

  // Two-level browse: `group` is the panel type (I-Phase / III-Phase / WLC),
  // `series` is the lettered series inside it. Both live in the URL so a
  // filtered view stays shareable.
  const activeGroupKey = searchParams.get("group") || undefined;
  const activeSeriesCode = searchParams.get("series") || undefined;
  const activeGroup = getGroupByKey(activeGroupKey);
  const activeSeries = getSeries(activeGroupKey, activeSeriesCode);

  // A group names a category by slug; the id only exists once the category
  // list has loaded. Kept as a primitive so it is a safe memo dependency —
  // the categories array itself is a fresh reference on every render.
  const groupCategoryId = findCategoryForGroup(categories, activeGroup)?.id;

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
      categoryId: groupCategoryId || params.get("categoryId") || undefined,
      phase: params.get("phase") || undefined,
      meterDisplayType: params.get("meterDisplayType") || undefined,
      seriesMatch: getSeriesMatchTokens(
        params.get("group"),
        params.get("series"),
      ),
    };
  }, [searchParamString, groupCategoryId]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [searchDraft, setSearchDraft] = useState(initialFilters.search || "");

  // A selected group whose category has not resolved would otherwise query the
  // whole catalog unfiltered. Hold the query until we know which it is: still
  // loading, or genuinely absent from the catalog.
  const groupCategoryUnresolved = Boolean(activeGroup) && !groupCategoryId;
  const groupCategoryMissing = groupCategoryUnresolved && !categoriesLoading;

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
  } = useShopProducts(filters, { pause: groupCategoryUnresolved });

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== false,
  ).length;

  useEffect(() => {
    setFilters(initialFilters);
    setSearchDraft(initialFilters.search || "");
  }, [initialFilters]);

  // price bands for the top bar. the query takes min/max, so each option is
  // just a pair — "All prices" clears both.
  const PRICE_BANDS = [
    { label: "All Prices", min: undefined, max: undefined },
    { label: "Under Rs. 2,000", min: undefined, max: 2000 },
    { label: "Rs. 2,000 – 5,000", min: 2000, max: 5000 },
    { label: "Rs. 5,000 – 10,000", min: 5000, max: 10000 },
    { label: "Over Rs. 10,000", min: 10000, max: undefined },
  ];

  const activePriceBand =
    PRICE_BANDS.findIndex(
      (band) =>
        band.min === initialFilters.minPrice &&
        band.max === initialFilters.maxPrice,
    ) ?? 0;

  // the catalogue query has no sort argument — these are the boolean
  // collection flags it does support, surfaced where the reference puts sort.
  const HIGHLIGHTS = [
    { label: "All Products", key: undefined },
    { label: "Featured", key: "isFeatured" },
    { label: "New Arrivals", key: "isNew" },
    { label: "Trending", key: "isTrending" },
    { label: "Best Sellers", key: "isBestSeller" },
  ];

  const activeHighlight =
    HIGHLIGHTS.find((item) => item.key && initialFilters[item.key])?.label ||
    "All Products";

  useEffect(() => {
    const normalizedDraft = searchDraft.trim();
    if ((filters.search || "") === normalizedDraft) return;

    const timeout = window.setTimeout(() => {
      updateFilters({ ...filters, search: normalizedDraft });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchDraft, filters]);

  /**
   * `browse` is passed only by the category/series chips. Every other caller
   * leaves the current browse selection alone — except the drawer's category
   * dropdown, which overrides the group when it picks a different category.
   */
  const updateFilters = (
    newFilters: FilterValues,
    browse?: { group?: string; series?: string },
  ) => {
    const params = new URLSearchParams(searchParamString);
    const categoryChanged =
      !browse && (newFilters.categoryId || undefined) !== groupCategoryId;

    const nextGroup = browse
      ? browse.group
      : categoryChanged
        ? undefined
        : params.get("group") || undefined;
    const nextSeries = browse
      ? browse.series
      : categoryChanged
        ? undefined
        : params.get("series") || undefined;

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

    if (nextGroup) {
      // categoryId is derived from the group, so it is not written to the URL.
      query.set("group", nextGroup);
      if (nextSeries) query.set("series", nextSeries);
    } else if (!browse && newFilters.categoryId) {
      query.set("categoryId", newFilters.categoryId);
    }

    if (newFilters.phase) query.set("phase", newFilters.phase);
    if (newFilters.meterDisplayType)
      query.set("meterDisplayType", newFilters.meterDisplayType);

    const queryString = query.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop");
  };

  /** Picking a panel type clears whatever series was selected under the old one. */
  const handleGroupSelect = (groupKey?: string) => {
    updateFilters(filters, { group: groupKey, series: undefined });
  };

  const handleSeriesSelect = (seriesCode?: string) => {
    updateFilters(filters, { group: activeGroupKey, series: seriesCode });
  };

  const handleReset = () => {
    router.push("/shop");
  };

  const noProductsFound =
    groupCategoryMissing ||
    (hasLoaded && displayedProducts.length === 0 && !loading && !error);
  const catalogCountText =
    loading && displayedProducts.length === 0
      ? "Loading products..."
      : groupCategoryMissing
        ? "No products in this category yet"
        : `${totalCount} products available for enquiry`;

  return (
    <MainLayout isDemoCatalog={isDemoCatalog}>
      <div className="min-h-screen bg-[#f6f9fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1640px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_18px_50px_rgba(11,31,51,0.06)]">
          <div className="border-b border-slate-100 bg-white">
            <div className="px-5 py-5 sm:px-7 lg:px-9">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  Product
                </h1>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  {catalogCountText}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-gray-800"
                >
                  <Filter size={18} />
                  <span className="font-medium">All Filters</span>
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

        <div className="px-5 py-5 sm:px-7 sm:py-6 lg:px-9">
          {/* Browse strip — panel type on the first row, and once one is
              picked, the lettered series inside it on the second. Mirrors the
              MRK product register; the taxonomy lives in data/catalog/series. */}
          <div className="mb-4 rounded-xl border border-slate-100 bg-white p-3 shadow-[0_8px_22px_rgba(11,31,51,0.045)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Category
              </span>
              <button
                type="button"
                onClick={() => handleGroupSelect(undefined)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  !activeGroup
                    ? "border-[#1598df] bg-[#1598df] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#1598df] hover:text-[#1598df]"
                }`}
              >
                All Products
              </button>
              {CATALOG_GROUPS.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => handleGroupSelect(group.key)}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    activeGroupKey === group.key
                      ? "border-[#1598df] bg-[#1598df] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#1598df] hover:text-[#1598df]"
                  }`}
                >
                  {group.shortLabel}
                </button>
              ))}
            </div>

            {activeGroup && activeGroup.series.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {activeGroup.seriesLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSeriesSelect(undefined)}
                    className={`rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                      !activeSeries
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900"
                    }`}
                  >
                    All
                  </button>
                  {activeGroup.series.map((series) => (
                    <button
                      key={series.code}
                      type="button"
                      onClick={() => handleSeriesSelect(series.code)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                        activeSeriesCode === series.code
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${
                          activeSeriesCode === series.code
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {series.letter}
                      </span>
                      {series.label}
                    </button>
                  ))}
                </div>

                {activeSeries && activeSeries.models.length > 0 && (
                  <p className="mt-2.5 text-xs text-slate-500">
                    Models in {activeSeries.label}:{" "}
                    <span className="font-medium text-slate-700">
                      {activeSeries.models.join(", ")}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Search / price / highlight bar. Replaces the left sidebar; the
              full filter set still opens in the drawer. */}
          <div className="mb-5 rounded-xl border border-slate-100 bg-white p-3 shadow-[0_8px_22px_rgba(11,31,51,0.045)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      updateFilters({ ...filters, search: searchDraft.trim() });
                  }}
                  onBlur={() => {
                    const normalizedDraft = searchDraft.trim();
                    if ((filters.search || "") !== normalizedDraft)
                      updateFilters({ ...filters, search: normalizedDraft });
                  }}
                  placeholder="Search products, models, HP..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2.5 pl-11 pr-4 text-[13px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#1598df] focus:bg-white"
                />
              </div>

              <select
                value={activePriceBand > 0 ? activePriceBand : 0}
                onChange={(e) => {
                  const band = PRICE_BANDS[Number(e.target.value)];
                  updateFilters({
                    ...filters,
                    minPrice: band.min,
                    maxPrice: band.max,
                  });
                }}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-700 outline-none transition-colors focus:border-[#1598df] lg:w-[160px]"
              >
                {PRICE_BANDS.map((band, bandIndex) => (
                  <option key={band.label} value={bandIndex}>
                    {band.label}
                  </option>
                ))}
              </select>

              <select
                value={activeHighlight}
                onChange={(e) => {
                  const picked = HIGHLIGHTS.find(
                    (item) => item.label === e.target.value,
                  );
                  updateFilters({
                    ...filters,
                    isFeatured: undefined,
                    isNew: undefined,
                    isTrending: undefined,
                    isBestSeller: undefined,
                    ...(picked?.key ? { [picked.key]: true } : {}),
                  });
                }}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-700 outline-none transition-colors focus:border-[#1598df] lg:w-[160px]"
              >
                {HIGHLIGHTS.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>

            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:gap-6 xl:gap-8">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[90] bg-black/50"
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
              {loading && !displayedProducts.length && !groupCategoryMissing && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={index}
                      className="flex overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-sm animate-pulse max-[520px]:flex-col"
                    >
                      <div className="w-[42%] flex-none bg-gray-200 max-[520px]:aspect-[16/10] max-[520px]:w-full"></div>
                      <div className="flex-1 space-y-3 p-5">
                        <div className="h-4 rounded bg-gray-200"></div>
                        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                        <div className="h-6 w-1/2 rounded bg-gray-200"></div>
                        <div className="h-9 rounded bg-gray-200"></div>
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
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {displayedProducts.map(
                      (product: Product, index: number) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ProductCard product={product} index={index} compact />
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
                            Loading more products...
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={handleShowMore}
                          disabled={isFetchingMore}
                          className="rounded-xl bg-black px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-xl"
                        >
                          Load More Products
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
      </div>
    </MainLayout>
  );
};

export default ShopPage;
