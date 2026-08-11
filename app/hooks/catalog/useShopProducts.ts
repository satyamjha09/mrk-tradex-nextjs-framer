// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/app/gql/Product";
import { Product } from "@/app/types/productTypes";
import {
  filterDemoProducts,
  paginateDemoProducts,
} from "@/app/data/demo/catalog";
import { isDemoCatalogForced, shouldUseDemoCatalog } from "@/app/lib/catalog/demoMode";
import { getDemoCatalogProducts } from "@/app/lib/demo/products";
import type { FilterValues } from "@/app/(public)/shop/ProductFilters";

const PAGE_SIZE = 100;

/**
 * `pause` holds the query while the caller is still resolving a filter — the
 * shop page uses it so a `?group=` URL never fires an unfiltered request in the
 * gap before the category list arrives.
 */
export function useShopProducts(
  filters: FilterValues,
  { pause = false }: { pause?: boolean } = {},
) {
  const forceDemo = isDemoCatalogForced();
  const [skip, setSkip] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { first: PAGE_SIZE, skip: 0, filters },
    fetchPolicy: "no-cache",
    skip: forceDemo || pause,
  });

  const isDemoCatalog = shouldUseDemoCatalog(Boolean(error));

  const filteredDemoProducts = useMemo(
    () =>
      isDemoCatalog
        ? filterDemoProducts(getDemoCatalogProducts(), filters)
        : [],
    [isDemoCatalog, filters]
  );
  const totalCount = isDemoCatalog
    ? filteredDemoProducts.length
    : data?.products?.totalCount ?? displayedProducts.length;
  const hasLoaded = isDemoCatalog || Boolean(data?.products) || Boolean(error);

  useEffect(() => {
    if (!isDemoCatalog) return;
    const page = paginateDemoProducts(filteredDemoProducts, 0, PAGE_SIZE);
    setDisplayedProducts(page.products);
    setHasMore(page.hasMore);
    setSkip(0);
  }, [isDemoCatalog, filteredDemoProducts]);

  useEffect(() => {
    if (isDemoCatalog || !data?.products) return;
    setDisplayedProducts(data.products.products);
    setHasMore(data.products.hasMore);
    setSkip(0);
    setIsFetchingMore(false);
  }, [data, isDemoCatalog]);

  useEffect(() => {
    if (isDemoCatalog) return;
    if (data?.products) return;
    setDisplayedProducts([]);
    setSkip(0);
    setHasMore(false);
    setIsFetchingMore(false);
  }, [filters, isDemoCatalog, data]);

  const handleShowMore = () => {
    if (isFetchingMore) return;

    if (isDemoCatalog) {
      const newSkip = skip + PAGE_SIZE;
      const page = paginateDemoProducts(filteredDemoProducts, newSkip, PAGE_SIZE);
      setDisplayedProducts((prev) => [...prev, ...page.products]);
      setSkip(newSkip);
      setHasMore(page.hasMore);
      return;
    }

    setIsFetchingMore(true);
    const newSkip = skip + PAGE_SIZE;
    fetchMore({
      variables: { first: PAGE_SIZE, skip: newSkip, filters },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const newProducts = fetchMoreResult.products.products;
        setDisplayedProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setSkip(newSkip);
        setHasMore(fetchMoreResult.products.hasMore);
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

  return {
    displayedProducts,
    // A paused query reports as loading so the caller shows skeletons rather
    // than an empty grid while the filter it is waiting on resolves.
    loading: isDemoCatalog
      ? false
      : pause || (loading && !displayedProducts.length),
    error: isDemoCatalog ? undefined : error,
    totalCount,
    hasLoaded,
    hasMore,
    isFetchingMore,
    handleShowMore,
    isDemoCatalog,
  };
}
