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
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  compact = false,
}) => {
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
  // only claim availability when the catalogue actually publishes stock for
  // this product — silence is not "in stock".
  const shouldShowInStock = stockVisibleVariants.length > 0 && !shouldShowOutOfStock;
  const primaryVariant = activeVariants[0];
  const rawProductImage = primaryVariant?.images[0];
  const shouldUseFallbackImage =
    !rawProductImage ||
    rawProductImage.startsWith("data:image/svg+xml") ||
    rawProductImage.includes("mrk-control-panel-hero");
  const productImage = shouldUseFallbackImage ? HeroImage : rawProductImage;
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
      className={`group relative flex h-full overflow-hidden border border-slate-200/80 bg-white text-[#0b1f33] transition duration-300 hover:-translate-y-1 max-[520px]:flex-col ${
        compact
          ? "rounded-[14px] shadow-[0_8px_22px_rgba(11,31,51,0.05)] hover:shadow-[0_16px_34px_rgba(11,31,51,0.1)]"
          : "rounded-[18px] shadow-[0_10px_28px_rgba(11,31,51,0.06)] hover:shadow-[0_20px_44px_rgba(11,31,51,0.12)]"
      }`}
    >
      {/* Image tile, flush to the card's left edge */}
      <div
        className={`relative flex flex-none items-center justify-center overflow-hidden bg-[#f3f8fc] max-[520px]:aspect-[16/10] max-[520px]:w-full ${
          compact ? "w-[39%]" : "w-[42%]"
        }`}
      >
        <Image
          src={productImage}
          alt={product.name}
          fill
          className={`transition-transform duration-500 group-hover:scale-105 ${
            shouldUseFallbackImage
              ? "object-cover object-right"
              : compact
                ? "object-contain p-4"
                : "object-contain p-5"
          }`}
          sizes={
            compact
              ? "(max-width: 520px) 92vw, (max-width: 1280px) 32vw, 210px"
              : "(max-width: 520px) 92vw, (max-width: 1280px) 40vw, 260px"
          }
          onError={(e) => {
            e.currentTarget.src = HeroImage.src;
          }}
        />

        {shouldShowOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
              Currently unavailable
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`flex min-w-0 flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <h3
          className={`line-clamp-2 font-bold leading-[1.25] tracking-[-0.01em] ${
            compact ? "text-[15px] sm:text-[16px]" : "text-[17px] sm:text-[19px]"
          }`}
        >
          {product.name}
        </h3>

        <p
          className={`line-clamp-2 leading-[1.55] text-[#5d7488] ${
            compact ? "mt-1.5 text-[12px] sm:text-[13px]" : "mt-2 text-[13px] sm:text-sm"
          }`}
        >
          {description}
        </p>

        <div
          className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 ${
            compact ? "mt-3" : "mt-4"
          }`}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#91a1b2]">
              MRP
            </span>
            <span
              className={`font-extrabold leading-none text-[#1598df] ${
                compact ? "text-[18px] sm:text-[19px]" : "text-[19px] sm:text-[21px]"
              }`}
            >
              {lowestPrice !== null
                ? `Rs. ${lowestPrice.toLocaleString("en-IN")}`
                : "On enquiry"}
            </span>
          </div>

          {shouldShowInStock && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              In Stock
            </span>
          )}
          {shouldShowOutOfStock && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-500">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Unavailable
            </span>
          )}
        </div>

        {specs.length > 0 && (
          <p
            className={`mt-3 line-clamp-1 font-semibold text-[#0b1f33] ${
              compact ? "text-[12px] sm:text-[13px]" : "text-[13px] sm:text-sm"
            }`}
          >
            {specs.join(" | ")}
          </p>
        )}

        <span
          className={`mt-auto block w-full rounded-lg border border-slate-200 px-4 text-center font-semibold text-[#0b1f33] transition-colors duration-300 group-hover:border-[#1598df] group-hover:bg-[#1598df] group-hover:text-white ${
            compact ? "py-2 text-[12px] sm:text-[13px]" : "py-2.5 text-[13px] sm:text-sm"
          }`}
        >
          View Details
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
