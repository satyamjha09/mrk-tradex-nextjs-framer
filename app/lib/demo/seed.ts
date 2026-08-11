// @ts-nocheck
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/app/data/demo/catalog";
import type {
  DemoAdminProduct,
  DemoAttribute,
  DemoCategory,
  DemoLog,
  DemoOrder,
  DemoState,
  DemoTransaction,
  DemoUser,
  DemoVariant,
  DemoMrkDealer,
  DemoMrkDownloadAsset,
  DemoMrkSiteSetting,
  DemoMrkTestimonial,
} from "./types";

export const DEMO_ACCOUNT_EMAILS = {
  user: "user@example.com",
  admin: "admin@example.com",
  superadmin: "superadmin@example.com",
} as const;

export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-user-1",
    name: "Demo User",
    email: DEMO_ACCOUNT_EMAILS.user,
    role: "USER",
    emailVerified: true,
    avatar: null,
  },
  {
    id: "demo-user-2",
    name: "Demo Admin",
    email: DEMO_ACCOUNT_EMAILS.admin,
    role: "ADMIN",
    emailVerified: true,
    avatar: null,
  },
  {
    id: "demo-user-3",
    name: "Demo Superadmin",
    email: DEMO_ACCOUNT_EMAILS.superadmin,
    role: "SUPERADMIN",
    emailVerified: true,
    avatar: null,
  },
];

function buildAdminProducts(): DemoAdminProduct[] {
  return DEMO_PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    shortDescription: p.shortDescription,
    modelNumber: p.modelNumber,
    tagline: p.tagline,
    productLine: p.productLine,
    productSeries: p.productSeries,
    phase: p.phase,
    hp: p.hp,
    boxType: p.boxType,
    meterType: p.meterType,
    startCapacitor: p.startCapacitor,
    runCapacitor: p.runCapacitor,
    capacitor: p.capacitor,
    maxLoad: p.maxLoad,
    mcbRelayOlp: p.mcbRelayOlp,
    warranty: p.warranty,
    voltage: p.voltage,
    ampRating: p.ampRating,
    suitableFor: p.suitableFor,
    protectionFeatures: p.protectionFeatures,
    useCases: p.useCases,
    manualUrl: p.manualUrl,
    videoUrl: p.videoUrl,
    featuredVideoUrl: p.featuredVideoUrl,
    isCatalogVisible: p.isCatalogVisible,
    enquiryEnabled: p.enquiryEnabled,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
    isBestSeller: p.isBestSeller,
    averageRating: p.averageRating,
    reviewCount: p.reviewCount,
    categoryId: p.category?.id ?? DEMO_CATEGORIES[0].id,
    category: p.category
      ? {
          id: p.category.id,
          slug: p.category.slug,
          name: p.category.name,
          description:
            "description" in p.category
              ? String(p.category.description ?? "")
              : "",
        }
      : undefined,
    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      lowStockThreshold: v.lowStockThreshold,
      barcode: v.barcode,
      warehouseLocation: v.warehouseLocation,
      images: v.images ?? [],
      priceVisible: v.priceVisible,
      stockVisible: v.stockVisible,
      hp: v.hp,
      hpMin: v.hpMin,
      hpMax: v.hpMax,
      phase: v.phase,
      variantType: v.variantType,
      maxLoadAmps: v.maxLoadAmps,
      boxType: v.boxType,
      bodyType: v.bodyType,
      meterType: v.meterType,
      meterDisplayType: v.meterDisplayType,
      meterSize: v.meterSize,
      startCapacitor: v.startCapacitor,
      runCapacitor: v.runCapacitor,
      mcbRelayOlp: v.mcbRelayOlp,
      warranty: v.warranty,
      protectionFeatures: v.protectionFeatures,
      manualUrl: v.manualUrl,
      videoUrl: v.videoUrl,
      isActive: v.isActive,
      sortOrder: v.sortOrder,
      attributes: v.attributes ?? [],
    })),
  }));
}

function buildVariants(products: DemoAdminProduct[]): DemoVariant[] {
  return products.flatMap((p) =>
    p.variants.map((v) => ({
      id: v.id,
      productId: p.id,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      lowStockThreshold: v.lowStockThreshold,
      barcode: v.barcode,
      warehouseLocation: v.warehouseLocation,
      attributes: [],
      product: { id: p.id, name: p.name, slug: p.slug },
    }))
  );
}

const DEMO_ATTRIBUTES: DemoAttribute[] = [
  {
    id: "demo-attr-color",
    name: "Color",
    slug: "color",
    values: [
      { id: "demo-val-red", value: "Red", slug: "red" },
      { id: "demo-val-blue", value: "Blue", slug: "blue" },
    ],
  },
  {
    id: "demo-attr-size",
    name: "Size",
    slug: "size",
    values: [
      { id: "demo-val-s", value: "Small", slug: "small" },
      { id: "demo-val-m", value: "Medium", slug: "medium" },
    ],
  },
];

function buildCategories(): DemoCategory[] {
  return DEMO_CATEGORIES.map((c) => ({
    ...c,
    attributes: DEMO_ATTRIBUTES.map((attr) => ({
      isRequired: false,
      attribute: attr,
    })),
  }));
}

const SAMPLE_ORDERS: DemoOrder[] = [
  {
    id: "demo-order-1",
    userId: "demo-user-1",
    status: "DELIVERED",
    amount: 749.98,
    orderDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    orderItems: [
      {
        id: "demo-oi-1",
        quantity: 1,
        price: 599.99,
        productName: "Smartphone X",
        variant: {
          id: "demo-var-1",
          sku: "SMART-X-001",
          product: { id: "demo-prod-1", name: "Smartphone X" },
        },
      },
      {
        id: "demo-oi-2",
        quantity: 1,
        price: 149.99,
        productName: "Wireless Headphones Pro",
        variant: {
          id: "demo-var-2",
          sku: "WH-PRO-001",
          product: { id: "demo-prod-2", name: "Wireless Headphones Pro" },
        },
      },
    ],
  },
];

const SAMPLE_TRANSACTIONS: DemoTransaction[] = [
  {
    id: "demo-tx-1",
    amount: 749.98,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    user: { id: "demo-user-1", name: "Demo User", email: DEMO_ACCOUNT_EMAILS.user },
    order: { id: "demo-order-1" },
  },
  {
    id: "demo-tx-2",
    amount: 119.99,
    status: "PENDING",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: { id: "demo-user-1", name: "Demo User", email: DEMO_ACCOUNT_EMAILS.user },
    order: { id: "demo-order-2" },
  },
];

const SAMPLE_LOGS: DemoLog[] = [
  {
    id: "demo-log-1",
    level: "info",
    message: "Demo mode started",
    context: { source: "client" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-log-2",
    level: "warn",
    message: "Sample warning for dashboard preview",
    context: { module: "inventory" },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const SAMPLE_MRK_DEALERS: DemoMrkDealer[] = [
  {
    id: "demo-dealer-ghaziabad",
    name: "MRK Demo Dealer",
    businessName: "MRK Demo Electricals",
    contactPerson: "Demo Contact",
    phone: "+91 93197 19670",
    whatsapp: "+91 93197 19670",
    email: "rajesh.mrktradex@gmail.com",
    address: "GT Road, Sahibabad",
    city: "Ghaziabad",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    pincode: "201005",
    latitude: null,
    longitude: null,
    active: true,
    featured: true,
    serviceAreas: ["Ghaziabad", "Delhi NCR"],
  },
];

const SAMPLE_MRK_DOWNLOAD_ASSETS: DemoMrkDownloadAsset[] = [
  {
    id: "demo-download-catalog",
    title: "MRK Product Catalogue",
    slug: "mrk-product-catalogue",
    description: "Demo catalogue entry for MRK pump starter products.",
    type: "CATALOG",
    fileUrl: "#",
    thumbnailUrl: null,
    language: "EN",
    active: true,
    sortOrder: 0,
    version: "Demo",
    effectiveDate: null,
    product: null,
    variant: null,
  },
];

const SAMPLE_MRK_TESTIMONIALS: DemoMrkTestimonial[] = [
  {
    id: "demo-testimonial",
    quote: "Reliable products and practical support from the MRK team.",
    name: "Demo Dealer",
    city: "Ghaziabad",
    role: "DEALER",
    active: true,
    sortOrder: 0,
  },
];

const SAMPLE_MRK_SITE_SETTING: DemoMrkSiteSetting = {
  id: "demo-site-setting",
  key: "global",
  phone: "+91 93197 19670",
  whatsapp: "919319719670",
  email: "mrktradex@gmail.com",
  address:
    "R/3A, Dooars Trp Compound, GT Road, Sahibabad, Ghaziabad, Uttar Pradesh 201005",
  gstNumber: null,
  youtubeUrl: null,
  businessHours: null,
  statistics: null,
  seoDefaults: null,
  socialLinks: null,
};

export function createInitialDemoState(): DemoState {
  const products = buildAdminProducts();
  return {
    users: DEMO_USERS,
    carts: {
      guest: { id: "demo-cart-guest", cartItems: [] },
      "demo-user-1": { id: "demo-cart-user-1", cartItems: [] },
      "demo-user-2": { id: "demo-cart-admin", cartItems: [] },
      "demo-user-3": { id: "demo-cart-super", cartItems: [] },
    },
    orders: SAMPLE_ORDERS,
    products,
    categories: buildCategories(),
    attributes: DEMO_ATTRIBUTES,
    variants: buildVariants(products),
    transactions: SAMPLE_TRANSACTIONS,
    logs: SAMPLE_LOGS,
    reviews: [
      {
        id: "demo-review-1",
        productId: "demo-prod-1",
        userId: "demo-user-1",
        rating: 5,
        comment: "Great demo product!",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        user: { id: "demo-user-1", name: "Demo User", avatar: null },
      },
    ],
    mrkEnquiries: [],
    mrkDealerApplications: [],
    mrkContactSubmissions: [],
    mrkDealers: SAMPLE_MRK_DEALERS,
    mrkDownloadAssets: SAMPLE_MRK_DOWNLOAD_ASSETS,
    mrkTestimonials: SAMPLE_MRK_TESTIMONIALS,
    mrkSiteSetting: SAMPLE_MRK_SITE_SETTING,
  };
}

export function findDemoUserByEmail(email: string): DemoUser | undefined {
  return DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
}
