// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import useTrackInteraction from "@/app/hooks/miscellaneous/useTrackInteraction";
import HeroImage from "@/app/assets/images/mrk-control-panel-hero.png";
import { formatMrkSpecValue } from "@/app/lib/format/mrkSpecs";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { trackInteraction } = useTrackInteraction();

  useEffect(() => {
    trackInteraction(product.id, "view");
  }, [product.id, trackInteraction]);

  const handleClick = () => {
    trackInteraction(product.id, "click");
  };

  const activeVariants = product.variants.filter(
    (variant) => variant.isActive !== false,
  );
  const stockVisibleVariants = activeVariants.filter(
    (variant) => variant.stockVisible === true,
  );
  const priceVisibleVariants = activeVariants.filter(
    (variant) => variant.priceVisible !== false,
  );
  const lowestPrice =
    priceVisibleVariants.length > 0
      ? Math.min(...priceVisibleVariants.map((variant) => variant.price))
      : null;
  const shouldShowOutOfStock =
    stockVisibleVariants.length > 0 &&
    stockVisibleVariants.every((variant) => variant.stock <= 0);
  const primaryVariant = activeVariants[0];
  const rawProductImage = primaryVariant?.images[0];
  const shouldUseFallbackImage =
    !rawProductImage ||
    rawProductImage.startsWith("data:image/svg+xml") ||
    rawProductImage.includes("mrk-control-panel-hero");
  const productImage = shouldUseFallbackImage ? HeroImage : rawProductImage;
  const highlighted = index % 2 === 1;
  const description =
    product.shortDescription ||
    product.tagline ||
    product.description ||
    "MRK pump protection product built for dependable field use.";
  const specs = [
    primaryVariant?.hp || product.hp,
    primaryVariant?.phase || product.phase,
    primaryVariant?.meterDisplayType || primaryVariant?.meterType,
  ]
    .map(formatMrkSpecValue)
    .filter(Boolean);

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={handleClick}
      className={`group relative flex min-h-[430px] flex-col overflow-hidden rounded-[22px] p-4 shadow-[0_18px_42px_rgba(11,31,51,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(11,31,51,0.16)] sm:min-h-[480px] sm:rounded-[24px] sm:p-5 lg:min-h-[520px] lg:rounded-[28px] ${
        highlighted
          ? "bg-gradient-to-br from-[#2186d7] via-[#1265ad] to-[#0b4b87] text-white"
          : "border border-slate-100 bg-white text-[#0b1f33]"
      }`}
    >
      <div
        className={`relative flex aspect-[1.18] w-full items-center justify-center overflow-hidden rounded-[18px] sm:aspect-[1.1] sm:rounded-[22px] lg:aspect-[1.08] ${
          highlighted
            ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            : "bg-[#f3f8fc]"
        }`}
      >
        <div className="relative h-full w-full">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className={`transition-transform duration-500 group-hover:scale-105 ${
              shouldUseFallbackImage
                ? "object-cover object-right"
                : "object-contain p-5 sm:p-7 lg:p-8"
            }`}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, (max-width: 1536px) 28vw, 360px"
            onError={(e) => {
              e.currentTarget.src = HeroImage.src;
            }}
          />
        </div>

        {shouldShowOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
              Currently unavailable
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4 sm:pt-5">
        <h3 className="line-clamp-2 text-[21px] font-extrabold leading-[1.1] tracking-normal sm:text-[23px] lg:text-[25px]">
          {product.name}
        </h3>
        <p
          className={`mt-2 line-clamp-3 text-sm leading-6 sm:text-[15px] ${
            highlighted ? "text-white/82" : "text-[#5d7488]"
          }`}
        >
          {description}
        </p>

        <div className="mt-auto pt-6 sm:pt-8">
          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className={`text-sm font-semibold uppercase tracking-wide ${
                highlighted ? "text-white/58" : "text-[#91a1b2]"
              }`}
            >
              MRP
            </span>
            <span className="text-[21px] font-black leading-none sm:text-[23px] lg:text-[25px]">
              {lowestPrice !== null
                ? `Rs. ${lowestPrice.toLocaleString("en-IN")}`
                : "On enquiry"}
            </span>
          </div>
          {specs.length > 0 && (
            <p
              className={`mt-3 line-clamp-1 text-sm font-semibold sm:mt-4 sm:text-[15px] ${
                highlighted ? "text-white/88" : "text-[#0b1f33]"
              }`}
            >
              {specs.join(" | ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
