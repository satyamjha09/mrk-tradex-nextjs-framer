// @ts-nocheck
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import groupProductsByFlag from "@/app/utils/groupProductsByFlag";
import SkeletonLoader from "@/app/components/feedback/SkeletonLoader";
import { useProductsSummary } from "@/app/hooks/catalog/useProductsSummary";

const HeroSection = dynamic(() => import("@/app/(public)/(home)/HeroSection"), {
  ssr: false,
});
const CategoryBar = dynamic(() => import("@/app/(public)/(home)/CategoryBar"), {
  ssr: false,
});
const ProductSection = dynamic(
  () => import("@/app/(public)/product/ProductSection"),
  { ssr: false },
);
const MainLayout = dynamic(() => import("@/app/components/templates/MainLayout"), {
  ssr: false,
});

const StorePage = () => {
  const { products, loading, error, isDemoCatalog } = useProductsSummary(100);

  const { featured, trending, newArrivals, bestSellers } = useMemo(() => {
    if (!products.length) {
      return { featured: [], trending: [], newArrivals: [], bestSellers: [] };
    }
    return groupProductsByFlag(products);
  }, [products]);

  if (loading) {
    return (
      <MainLayout>
        <HeroSection />
        <SkeletonLoader />
      </MainLayout>
    );
  }

  return (
    <MainLayout isDemoCatalog={isDemoCatalog}>
      <HeroSection />
      <CategoryBar />
      <ProductSection
        title="Top Picks For You"
        products={featured}
        loading={false}
        error={error}
        showTitle={true}
      />
      <ProductSection
        title="Fresh Finds"
        products={trending}
        loading={false}
        error={error}
        showTitle={true}
      />
      <ProductSection
        title="New Launches"
        products={newArrivals}
        loading={false}
        error={error}
        showTitle={true}
      />
      <ProductSection
        title="Be Limitless"
        products={bestSellers}
        loading={false}
        error={error}
        showTitle={true}
      />
    </MainLayout>
  );
};

export default StorePage;
