// @ts-nocheck
import type { Product } from "@/app/types/productTypes";
import { DEMO_PRODUCTS } from "@/app/data/demo/catalog";
import type { DemoAdminProduct, DemoCategory } from "./types";
import { getDemoState } from "./store";

function normalizeCategory(category?: DemoCategory | null) {
  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

function hasDisplayValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function valueOrSeed<T>(value: T, seededValue: T): T {
  return hasDisplayValue(value) ? value : seededValue;
}

export function demoProductToCatalogProduct(
  product: DemoAdminProduct,
): Product {
  const state = getDemoState();
  const seededProduct = DEMO_PRODUCTS.find(
    (item) => item.slug === product.slug || item.id === product.id,
  );
  const category =
    product.category ??
    state.categories.find((item) => item.id === product.categoryId) ??
    seededProduct?.category ??
    null;
  const sourceVariants =
    product.variants?.length > 0 ? product.variants : seededProduct?.variants ?? [];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: valueOrSeed(product.description, seededProduct?.description ?? ""),
    shortDescription: valueOrSeed(
      product.shortDescription,
      seededProduct?.shortDescription ?? null,
    ),
    modelNumber: valueOrSeed(product.modelNumber, seededProduct?.modelNumber ?? null),
    tagline: valueOrSeed(product.tagline, seededProduct?.tagline ?? null),
    productLine: valueOrSeed(product.productLine, seededProduct?.productLine ?? null),
    productSeries: valueOrSeed(
      product.productSeries,
      seededProduct?.productSeries ?? null,
    ),
    phase: valueOrSeed(product.phase, seededProduct?.phase ?? null),
    hp: valueOrSeed(product.hp, seededProduct?.hp ?? null),
    boxType: valueOrSeed(product.boxType, seededProduct?.boxType ?? null),
    meterType: valueOrSeed(product.meterType, seededProduct?.meterType ?? null),
    startCapacitor: valueOrSeed(
      product.startCapacitor,
      seededProduct?.startCapacitor ?? null,
    ),
    runCapacitor: valueOrSeed(
      product.runCapacitor,
      seededProduct?.runCapacitor ?? null,
    ),
    capacitor: valueOrSeed(product.capacitor, seededProduct?.capacitor ?? null),
    maxLoad: valueOrSeed(product.maxLoad, seededProduct?.maxLoad ?? null),
    mcbRelayOlp: valueOrSeed(product.mcbRelayOlp, seededProduct?.mcbRelayOlp ?? null),
    warranty: valueOrSeed(product.warranty, seededProduct?.warranty ?? null),
    voltage: valueOrSeed(product.voltage, seededProduct?.voltage ?? null),
    ampRating: valueOrSeed(product.ampRating, seededProduct?.ampRating ?? null),
    suitableFor: valueOrSeed(product.suitableFor, seededProduct?.suitableFor ?? null),
    protectionFeatures: valueOrSeed(
      product.protectionFeatures,
      seededProduct?.protectionFeatures ?? [],
    ),
    useCases: valueOrSeed(product.useCases, seededProduct?.useCases ?? []),
    manualUrl: valueOrSeed(product.manualUrl, seededProduct?.manualUrl ?? null),
    videoUrl: valueOrSeed(product.videoUrl, seededProduct?.videoUrl ?? null),
    featuredVideoUrl: valueOrSeed(
      product.featuredVideoUrl,
      seededProduct?.featuredVideoUrl ?? null,
    ),
    isCatalogVisible: product.isCatalogVisible ?? true,
    enquiryEnabled: product.enquiryEnabled ?? true,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isTrending: product.isTrending,
    isBestSeller: product.isBestSeller,
    averageRating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    category: normalizeCategory(category),
    reviews: [],
    variants: sourceVariants.map((variant) => {
      const seededVariant = seededProduct?.variants.find(
        (item) => item.sku === variant.sku || item.id === variant.id,
      );

      return {
        id: variant.id,
        sku: variant.sku,
        price: Number(valueOrSeed(variant.price, seededVariant?.price ?? 0) || 0),
        priceVisible: variant.priceVisible ?? seededVariant?.priceVisible ?? true,
        images: valueOrSeed(variant.images, seededVariant?.images ?? []),
        stock: Number(valueOrSeed(variant.stock, seededVariant?.stock ?? 0) || 0),
        stockVisible: variant.stockVisible ?? seededVariant?.stockVisible ?? false,
        lowStockThreshold: Number(
          valueOrSeed(
            variant.lowStockThreshold,
            seededVariant?.lowStockThreshold ?? 10,
          ),
        ),
        barcode: valueOrSeed(variant.barcode, seededVariant?.barcode ?? null),
        warehouseLocation: valueOrSeed(
          variant.warehouseLocation,
          seededVariant?.warehouseLocation ?? null,
        ),
        hp: valueOrSeed(variant.hp, seededVariant?.hp ?? null),
        hpMin: valueOrSeed(variant.hpMin, seededVariant?.hpMin ?? null),
        hpMax: valueOrSeed(variant.hpMax, seededVariant?.hpMax ?? null),
        phase: valueOrSeed(variant.phase, seededVariant?.phase ?? null),
        variantType: valueOrSeed(
          variant.variantType,
          seededVariant?.variantType ?? null,
        ),
        maxLoadAmps: valueOrSeed(
          variant.maxLoadAmps,
          seededVariant?.maxLoadAmps ?? null,
        ),
        boxType: valueOrSeed(variant.boxType, seededVariant?.boxType ?? null),
        bodyType: valueOrSeed(variant.bodyType, seededVariant?.bodyType ?? null),
        meterType: valueOrSeed(variant.meterType, seededVariant?.meterType ?? null),
        meterDisplayType: valueOrSeed(
          variant.meterDisplayType,
          seededVariant?.meterDisplayType ?? null,
        ),
        meterSize: valueOrSeed(variant.meterSize, seededVariant?.meterSize ?? null),
        startCapacitor: valueOrSeed(
          variant.startCapacitor,
          seededVariant?.startCapacitor ?? null,
        ),
        runCapacitor: valueOrSeed(
          variant.runCapacitor,
          seededVariant?.runCapacitor ?? null,
        ),
        mcbRelayOlp: valueOrSeed(
          variant.mcbRelayOlp,
          seededVariant?.mcbRelayOlp ?? null,
        ),
        warranty: valueOrSeed(variant.warranty, seededVariant?.warranty ?? null),
        protectionFeatures: valueOrSeed(
          variant.protectionFeatures,
          seededVariant?.protectionFeatures ?? [],
        ),
        manualUrl: valueOrSeed(variant.manualUrl, seededVariant?.manualUrl ?? null),
        videoUrl: valueOrSeed(variant.videoUrl, seededVariant?.videoUrl ?? null),
        isActive: variant.isActive ?? seededVariant?.isActive ?? true,
        sortOrder: variant.sortOrder ?? seededVariant?.sortOrder ?? 0,
        attributes: valueOrSeed(variant.attributes, seededVariant?.attributes ?? []),
      };
    }),
  };
}

export function getDemoCatalogProducts(): Product[] {
  return getDemoState()
    .products.filter(
      (product) =>
        product.isActive !== false &&
        product.isPublished !== false &&
        product.isCatalogVisible !== false,
    )
    .map(demoProductToCatalogProduct);
}

export function getDemoCatalogProductBySlug(slug: string): Product | undefined {
  return getDemoCatalogProducts().find((product) => product.slug === slug);
}
