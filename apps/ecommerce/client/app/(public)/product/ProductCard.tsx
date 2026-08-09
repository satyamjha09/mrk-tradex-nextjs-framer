"use client";
import React, { useEffect } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import useTrackInteraction from "@/app/hooks/miscellaneous/useTrackInteraction";
import { useRouter } from "next/navigation";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import HeroImage from "@/app/assets/images/mrk-control-panel-hero.png";
import { formatMrkSpecValue } from "@/app/lib/format/mrkSpecs";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { trackInteraction } = useTrackInteraction();
  const router = useRouter();
  const { urls } = useMrkSiteSettings();

  useEffect(() => {
    trackInteraction(product.id, "view");
  }, [product.id, trackInteraction]);

  const handleClick = () => {
    trackInteraction(product.id, "click");
    router.push(`/product/${product.slug}`);
  };

  const activeVariants = product.variants.filter(
    (variant) => variant.isActive !== false,
  );
  const priceVisibleVariants = activeVariants.filter(
    (variant) => variant.priceVisible !== false,
  );
  const lowestPrice =
    priceVisibleVariants.length > 0
      ? Math.min(...priceVisibleVariants.map((variant) => variant.price))
      : null;
  const stockVisibleVariants = activeVariants.filter(
    (variant) => variant.stockVisible === true,
  );
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
  const specs = [
    primaryVariant?.hp || product.hp,
    primaryVariant?.phase || product.phase,
    primaryVariant?.meterDisplayType || primaryVariant?.meterType,
  ]
    .map(formatMrkSpecValue)
    .filter(Boolean);
  const badge = product.isNew
    ? "New Launch"
    : product.isFeatured
      ? "Featured"
      : product.category?.name || "MRK Catalog";

  return (
    <div
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-gray-100 bg-white p-3 shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#f4f4f4]">
        <Link
          href={`/product/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={productImage}
            alt={product.name}
            fill
            className={`transition-transform duration-500 group-hover:scale-105 ${
              shouldUseFallbackImage
                ? "object-cover object-right"
                : "object-contain p-8"
            }`}
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 354px"
            onError={(e) => {
              e.currentTarget.src = HeroImage.src;
            }}
          />
        </Link>

        {/* Product Flags */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          <span className="rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white">
            {badge}
          </span>
        </div>

        {/* Stock Status */}
        {shouldShowOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
              Currently unavailable
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col px-1 pb-1 pt-5">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="mb-3 line-clamp-2 text-xl font-black leading-tight text-black">
            {product.name}
          </h3>

          <div className="mb-3 flex flex-wrap items-baseline gap-2">
            {lowestPrice !== null ? (
              <>
                <span className="text-sm font-medium text-gray-400">MRP</span>
                <span className="text-xl font-black text-black">
                  Rs. {lowestPrice.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-black">
                MRP on enquiry
              </span>
            )}
          </div>

          {specs.length > 0 && (
            <div className="mb-3 line-clamp-1 text-sm text-black">
              {specs.join(" | ")}
            </div>
          )}

          {product.shortDescription && (
            <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
              {product.shortDescription}
            </p>
          )}
        </Link>

        {/* Quick Actions */}
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Details
            <ArrowRight size={16} />
          </button>
          <a
            href={`${urls.whatsapp}?text=${encodeURIComponent(
              `I want to enquire about ${product.name}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black text-black transition-colors hover:bg-black hover:text-white"
            aria-label={`WhatsApp enquiry for ${product.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
