// @ts-nocheck
"use client";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_SUMMARY } from "@/app/gql/Product";
import { Product } from "@/app/types/productTypes";
import { isDemoCatalogForced, shouldUseDemoCatalog } from "@/app/lib/catalog/demoMode";
import { getDemoCatalogProducts } from "@/app/lib/demo/products";

export function useProductsSummary(first = 100) {
  const forceDemo = isDemoCatalogForced();

  const { data, loading, error } = useQuery(GET_PRODUCTS_SUMMARY, {
    variables: { first },
    fetchPolicy: "no-cache",
    skip: forceDemo,
  });

  const isDemoCatalog = shouldUseDemoCatalog(Boolean(error));
  const products: Product[] = isDemoCatalog
    ? getDemoCatalogProducts().slice(0, first)
    : data?.products?.products ?? [];

  return {
    products,
    loading: isDemoCatalog ? false : loading,
    error: isDemoCatalog ? undefined : error,
    isDemoCatalog,
  };
}
