// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/app/assets/images/mrk-control-panel-hero.png";
import { useCatalogCategories } from "@/app/hooks/catalog/useCatalogCategories";
import {
  Cable,
  CircleGauge,
  Package,
  PlugZap,
  Settings,
  ShieldCheck,
  Waves,
  Zap,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  starter: Zap,
  starters: Zap,
  panel: Settings,
  panels: Settings,
  pump: Waves,
  pumps: Waves,
  singlephase: PlugZap,
  threephase: ShieldCheck,
  wlc: CircleGauge,
  smartplug: PlugZap,
  smartplugs: PlugZap,
  cable: Cable,
  cables: Cable,
  accessory: Package,
  accessories: Package,
};

const DefaultIcon = Package;

const CategoryBar = () => {
  const { categories, loading: isLoading, error } = useCatalogCategories();

  const getCategoryIcon = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase().replace(/\s+/g, "");
    if (categoryIcons[normalizedName]) return categoryIcons[normalizedName];

    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return icon;
      }
    }

    return DefaultIcon;
  };

  if (isLoading) {
    return (
      <section className="bg-white pt-14">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-8 lg:px-16">
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-[360px] min-w-[260px] animate-pulse rounded-[22px] bg-gray-100 sm:min-w-[340px] lg:min-w-[380px]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories.length) return null;

  return (
    <section className="bg-white pt-16">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-8 lg:px-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-normal text-black sm:text-4xl">
            Explore by Category
          </h2>
        </div>

        <div className="-mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden">
          {categories.map((category, index) => {
            const imageSrc = category.images?.[0] || null;
            const Icon = getCategoryIcon(category.name);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group"
              >
                <Link
                  href={`/shop?categoryId=${category.id}`}
                  className="block h-full snap-start"
                >
                  <div className="relative h-[360px] min-w-[260px] overflow-hidden rounded-[22px] bg-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 sm:min-w-[340px] lg:h-[430px] lg:min-w-[380px]">
                    <Image
                      src={imageSrc || HeroImage}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 380px"
                    />
                    {!imageSrc && (
                      <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                        <Icon className="h-7 w-7" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_34%,rgba(0,0,0,0.78)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-7 text-center text-white">
                      <p className="text-2xl font-light uppercase tracking-normal">
                        Shop
                      </p>
                      <h3 className="mt-1 text-3xl font-black leading-tight">
                        {category.name}
                      </h3>
                      {category.products && (
                        <p className="mt-2 text-sm font-medium text-white/80">
                          {category.products.length} catalog items
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
