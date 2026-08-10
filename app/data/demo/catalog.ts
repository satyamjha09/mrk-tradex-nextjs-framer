// @ts-nocheck
import { Product } from "@/app/types/productTypes";
import type { FilterValues } from "@/app/(public)/shop/ProductFilters";
import { productMatchesSeriesTokens } from "@/app/data/catalog/series";
import HeroImage from "@/app/assets/images/mrk-control-panel-hero.png";

export type DemoCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images?: string[];
  products?: Product[];
};

const singlePhaseStarters: DemoCategory = {
  id: "demo-cat-single-phase-starters",
  slug: "single-phase-starters",
  name: "Single Phase Starters",
  description: "Pump starter panels for domestic and agricultural motors",
};

const threePhasePanels: DemoCategory = {
  id: "demo-cat-three-phase-panels",
  slug: "three-phase-panels",
  name: "Three Phase Panels",
  description: "Protection panels for higher HP pump and motor loads",
};

const smartControls: DemoCategory = {
  id: "demo-cat-smart-controls",
  slug: "smart-controls",
  name: "Smart Controls",
  description: "WLC, smart plugs, relays, and control accessories",
};

const cablesAccessories: DemoCategory = {
  id: "demo-cat-cables-accessories",
  slug: "cables-accessories",
  name: "Cables & Accessories",
  description: "Cables, capacitors, switches, relays, and panel accessories",
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  singlePhaseStarters,
  threePhasePanels,
  smartControls,
  cablesAccessories,
];

type DemoVariantOptions = {
  images?: string[];
  hp?: string;
  hpMin?: number;
  hpMax?: number;
  phase?: string;
  variantType?: string;
  maxLoadAmps?: number;
  boxType?: string;
  bodyType?: string;
  meterType?: string;
  meterDisplayType?: string;
  meterSize?: string;
  startCapacitor?: string;
  runCapacitor?: string;
  mcbRelayOlp?: string;
  warranty?: string;
  protectionFeatures?: string[];
};

const DEMO_PRODUCT_IMAGE = HeroImage.src;
const THREE_PHASE_PANEL_IMAGES = [
  "/images/three-phase-panel.png",
  "/images/panel-components.png",
  "/images/intro-products.jpg",
  "/images/mrg-dpt-2-auto-timer.png",
];

function variant(
  id: string,
  sku: string,
  price: number,
  options: DemoVariantOptions = {},
): Product["variants"][0] {
  return {
    id,
    sku,
    price,
    priceVisible: true,
    images: [DEMO_PRODUCT_IMAGE],
    stock: 0,
    stockVisible: false,
    lowStockThreshold: 0,
    barcode: null,
    warehouseLocation: null,
    attributes: [],
    isActive: true,
    sortOrder: 0,
    ...options,
  };
}

function product(
  p: Omit<Product, "reviews"> & { reviews?: Product["reviews"] },
): Product {
  return {
    reviews: [],
    description: p.description ?? null,
    isCatalogVisible: true,
    enquiryEnabled: true,
    ...p,
  };
}

export const DEMO_PRODUCTS: Product[] = [
  product({
    id: "demo-prod-three-phase-panel-admin-demo",
    slug: "mrk-three-phase-control-panel-admin-demo",
    name: "MRK Three Phase Control Panel Admin Demo",
    shortDescription:
      "Three phase motor control panel for agricultural and industrial pump loads.",
    modelNumber: "MRK-TP-CP-5HP-ADMIN",
    productLine: "Control Panel",
    productSeries: "Three Phase Panel",
    phase: "THREE_PHASE",
    hp: "5 HP",
    maxLoad: "15 A",
    boxType: "Powder coated metal enclosure",
    meterType: "Digital",
    mcbRelayOlp: "MCB + relay + OLP",
    warranty: "12 months",
    voltage: "415 V",
    ampRating: "15 A",
    suitableFor: "Agriculture pump",
    protectionFeatures: ["Single phasing", "Overload", "Voltage guard"],
    useCases: ["Agriculture pump", "Industrial water transfer"],
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    averageRating: 0,
    reviewCount: 0,
    description:
      "Demo MRK three phase technical listing for dealer and product enquiries.",
    variants: [
      variant("demo-var-three-phase-panel-admin-demo", "MRK-TP-CP-5HP-ADMIN", 6450, {
        images: THREE_PHASE_PANEL_IMAGES,
        hp: "5 HP",
        hpMin: 5,
        hpMax: 5,
        phase: "THREE_PHASE",
        variantType: "Control panel",
        maxLoadAmps: 15,
        bodyType: "Powder coated metal enclosure",
        boxType: "Powder coated metal enclosure",
        meterType: "Digital",
        meterDisplayType: "DIGITAL",
        meterSize: "96 x 96 mm",
        mcbRelayOlp: "MCB + relay + OLP",
        warranty: "12 months",
        protectionFeatures: ["Single phasing", "Overload", "Voltage guard"],
      }),
    ],
    category: threePhasePanels,
  }),
  product({
    id: "demo-prod-single-phase-dol",
    slug: "mrk-single-phase-dol-starter",
    name: "MRK Single Phase DOL Starter",
    shortDescription:
      "Compact starter panel for single phase water pumps with overload protection.",
    productSeries: "DOL Starter",
    phase: "SINGLE_PHASE",
    hp: "0.5-2 HP",
    boxType: "Metal box",
    meterType: "Analog",
    warranty: "12 months",
    protectionFeatures: ["Overload protection", "MCB protection"],
    useCases: ["Domestic pump", "Borewell pump", "Small farm motor"],
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    averageRating: 0,
    reviewCount: 0,
    description:
      "Demo MRK catalog record for single phase pump starter enquiry flow.",
    variants: [
      variant("demo-var-single-phase-dol-1hp", "MRK-SP-DOL-1HP", 1850, {
        hp: "1 HP",
        hpMin: 1,
        hpMax: 1,
        phase: "SINGLE_PHASE",
        variantType: "DOL",
        maxLoadAmps: 10,
        meterType: "Analog",
        meterDisplayType: "ANALOG",
        startCapacitor: "100-120 MFD",
        runCapacitor: "36 MFD",
        mcbRelayOlp: "MCB + OLP",
        warranty: "12 months",
        protectionFeatures: ["Overload", "Short circuit"],
      }),
    ],
    category: singlePhaseStarters,
  }),
  product({
    id: "demo-prod-three-phase-panel",
    slug: "mrk-three-phase-control-panel",
    name: "MRK Three Phase Control Panel",
    shortDescription:
      "Three phase motor control panel for agricultural and industrial pump loads.",
    productSeries: "Three Phase Panel",
    phase: "THREE_PHASE",
    hp: "3-7.5 HP",
    boxType: "Powder coated metal enclosure",
    meterType: "Digital",
    warranty: "12 months",
    protectionFeatures: ["Phase failure", "Overload", "Dry run protection"],
    useCases: ["Agriculture pump", "Industrial water transfer"],
    isNew: false,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    averageRating: 0,
    reviewCount: 0,
    description:
      "Demo MRK three phase technical listing for dealer and product enquiries.",
    variants: [
      variant("demo-var-three-phase-5hp", "MRK-TP-CP-5HP", 6450, {
        hp: "5 HP",
        hpMin: 5,
        hpMax: 5,
        phase: "THREE_PHASE",
        variantType: "Control panel",
        maxLoadAmps: 15,
        meterType: "Digital",
        meterDisplayType: "DIGITAL",
        mcbRelayOlp: "MCB + relay + OLP",
        warranty: "12 months",
        protectionFeatures: ["Single phasing", "Overload", "Voltage guard"],
      }),
    ],
    category: threePhasePanels,
  }),
  product({
    id: "demo-prod-wlc-controller",
    slug: "mrk-water-level-controller",
    name: "MRK Water Level Controller",
    shortDescription:
      "Automatic water level control solution for tanks, pumps, and borewell applications.",
    productSeries: "WLC",
    phase: "SINGLE_PHASE",
    hp: "Up to 2 HP",
    boxType: "Compact ABS body",
    meterType: "Indicator LEDs",
    warranty: "12 months",
    protectionFeatures: ["Dry run control", "Auto cut-off"],
    useCases: ["Overhead tank", "Domestic pump automation"],
    isNew: true,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    averageRating: 0,
    reviewCount: 0,
    description:
      "Demo MRK smart control listing for technical information and enquiries.",
    variants: [
      variant("demo-var-wlc-basic", "MRK-WLC-BASIC", 2250, {
        hp: "Up to 2 HP",
        hpMin: 0.5,
        hpMax: 2,
        phase: "SINGLE_PHASE",
        variantType: "Water level controller",
        meterDisplayType: "DIGITAL",
        warranty: "12 months",
        protectionFeatures: ["Auto on/off", "Dry run support"],
      }),
    ],
    category: smartControls,
  }),
  product({
    id: "demo-prod-smart-plug",
    slug: "mrk-smart-pump-plug",
    name: "MRK Smart Pump Plug",
    shortDescription:
      "Smart plug-style pump control accessory for convenient switching and protection.",
    productSeries: "Smart Plug",
    phase: "SINGLE_PHASE",
    hp: "Up to 1.5 HP",
    boxType: "Plug-in body",
    warranty: "6 months",
    protectionFeatures: ["Load protection", "Easy installation"],
    useCases: ["Domestic pump", "Small motor control"],
    isNew: true,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    averageRating: 0,
    reviewCount: 0,
    description:
      "Demo MRK accessory listing for WhatsApp and dealer enquiry flows.",
    variants: [
      variant("demo-var-smart-plug", "MRK-SMART-PLUG", 950, {
        hp: "Up to 1.5 HP",
        hpMin: 0.5,
        hpMax: 1.5,
        phase: "SINGLE_PHASE",
        variantType: "Smart plug",
        maxLoadAmps: 8,
        warranty: "6 months",
      }),
    ],
    category: smartControls,
  }),
  product({
    id: "demo-prod-submersible-cable",
    slug: "mrk-submersible-cable",
    name: "MRK Submersible Cable",
    shortDescription:
      "Cable option for pump installation and service enquiries.",
    productSeries: "Cable",
    hp: "Application based",
    warranty: "As per catalogue",
    protectionFeatures: ["Flexible installation", "Pump service use"],
    useCases: ["Submersible pump", "Panel connection"],
    isNew: false,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
    averageRating: 0,
    reviewCount: 0,
    description: "Demo MRK cable listing for catalogue browsing.",
    variants: [
      variant("demo-var-cable-3core", "MRK-CABLE-3CORE", 1250, {
        variantType: "Cable",
        warranty: "As per catalogue",
      }),
    ],
    category: cablesAccessories,
  }),
  product({
    id: "demo-prod-capacitor-kit",
    slug: "mrk-capacitor-relay-kit",
    name: "MRK Capacitor & Relay Kit",
    shortDescription:
      "Accessory kit for pump starter service, replacement, and dealer enquiries.",
    productSeries: "Accessories",
    hp: "Model based",
    warranty: "6 months",
    protectionFeatures: ["Starter service support", "Matched accessories"],
    useCases: ["Starter repair", "Dealer service stock"],
    isNew: false,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
    averageRating: 0,
    reviewCount: 0,
    description: "Demo MRK accessory listing for service/dealer catalogue use.",
    variants: [
      variant("demo-var-capacitor-kit", "MRK-CAP-RELAY-KIT", 780, {
        variantType: "Accessory kit",
        startCapacitor: "Model specific",
        runCapacitor: "Model specific",
        mcbRelayOlp: "Relay kit",
        warranty: "6 months",
      }),
    ],
    category: cablesAccessories,
  }),
];

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function filterDemoProducts(
  products: Product[],
  filters: FilterValues,
): Product[] {
  return products.filter((productItem) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        productItem.name,
        productItem.shortDescription,
        productItem.productSeries,
        productItem.hp,
        productItem.phase,
        productItem.category?.name,
        ...productItem.variants.map((itemVariant) => itemVariant.sku),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(q)) return false;
    }
    if (filters.categoryId && productItem.category?.id !== filters.categoryId) {
      return false;
    }
    if (!productMatchesSeriesTokens(productItem, filters.seriesMatch)) {
      return false;
    }
    if (filters.isNew && !productItem.isNew) return false;
    if (filters.isFeatured && !productItem.isFeatured) return false;
    if (filters.isTrending && !productItem.isTrending) return false;
    if (filters.isBestSeller && !productItem.isBestSeller) return false;
    if (
      filters.phase &&
      productItem.phase !== filters.phase &&
      !productItem.variants.some(
        (itemVariant) => itemVariant.phase === filters.phase,
      )
    ) {
      return false;
    }
    if (
      filters.meterDisplayType &&
      !productItem.variants.some(
        (itemVariant) =>
          itemVariant.meterDisplayType === filters.meterDisplayType,
      )
    ) {
      return false;
    }

    const price =
      productItem.variants.find((itemVariant) => itemVariant.priceVisible)
        ?.price ?? 0;
    if (filters.minPrice !== undefined && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && price > filters.maxPrice) {
      return false;
    }

    return true;
  });
}

export function paginateDemoProducts(
  products: Product[],
  skip: number,
  first: number,
): { products: Product[]; hasMore: boolean; totalCount: number } {
  const slice = products.slice(skip, skip + first);
  return {
    products: slice,
    hasMore: skip + first < products.length,
    totalCount: products.length,
  };
}
