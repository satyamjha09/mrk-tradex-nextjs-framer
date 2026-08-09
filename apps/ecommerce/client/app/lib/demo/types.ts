export type DemoRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  emailVerified: boolean;
  avatar: string | null;
}

export interface DemoCartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    price: number;
    images: string[];
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface DemoCart {
  id: string;
  cartItems: DemoCartItem[];
}

export interface DemoOrderItem {
  id: string;
  quantity: number;
  price: number;
  variant?: {
    id: string;
    sku: string;
    product?: { id: string; name: string };
  };
  productName?: string;
}

export interface DemoOrder {
  id: string;
  userId: string;
  status: string;
  amount: number;
  orderDate: string;
  orderItems: DemoOrderItem[];
}

export interface DemoCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  attributes?: DemoCategoryAttribute[];
}

export interface DemoAttributeValue {
  id: string;
  value: string;
  slug: string;
}

export interface DemoAttribute {
  id: string;
  name: string;
  slug: string;
  values: DemoAttributeValue[];
}

export interface DemoCategoryAttribute {
  isRequired: boolean;
  attribute: DemoAttribute;
}

export interface DemoAdminProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  averageRating?: number;
  reviewCount?: number;
  categoryId: string;
  category?: DemoCategory;
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    stock: number;
    lowStockThreshold?: number;
    barcode?: string | null;
    warehouseLocation?: string | null;
    images: string[];
    attributes?: unknown[];
  }>;
}

export interface DemoVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold?: number;
  barcode?: string | null;
  warehouseLocation?: string | null;
  attributes: Array<{
    attributeId: string;
    valueId: string;
    attribute: { id: string; name: string; slug: string };
    value: { id: string; value: string; slug: string };
  }>;
  product?: { id: string; name: string; slug: string };
}

export interface DemoTransaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
  order?: { id: string };
}

export interface DemoLog {
  id: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  createdAt: string;
}

export interface DemoReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { id: string; name: string; avatar: string | null };
}

export type DemoMrkLeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED"
  | "SPAM";

export type DemoMrkDealerApplicationStatus =
  | "NEW"
  | "REVIEWING"
  | "APPROVED"
  | "REJECTED"
  | "ON_HOLD";

export interface DemoMrkEnquiryLead {
  id: string;
  name: string;
  phone: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
  pincode?: string;
  message?: string;
  source?: string;
  sourceType?: string;
  productId?: string;
  variantId?: string;
  categoryId?: string;
  status: DemoMrkLeadStatus;
  createdAt: string;
  updatedAt: string;
  product?: { id: string; name: string; slug: string; modelNumber?: string };
  category?: { id: string; name: string; slug: string };
  metadata?: Record<string, unknown>;
}

export interface DemoMrkDealerApplication {
  id: string;
  name: string;
  businessName: string;
  address: string;
  mobile: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  gstNumber?: string;
  currentBusiness?: string;
  productCategories?: string[];
  experience?: string;
  message?: string;
  status: DemoMrkDealerApplicationStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface DemoMrkContactSubmission {
  id: string;
  name: string;
  message: string;
  type?: "CONTACT" | "FEEDBACK";
  phone?: string;
  email?: string;
  subject?: string;
  city?: string;
  state?: string;
  status: DemoMrkLeadStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface DemoMrkDealer {
  id: string;
  name: string;
  businessName?: string | null;
  contactPerson?: string | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  address: string;
  city: string;
  district?: string | null;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  active: boolean;
  featured: boolean;
  serviceAreas: string[];
}

export interface DemoMrkDownloadAsset {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  type:
    | "CATALOG"
    | "PRICE_LIST"
    | "MANUAL"
    | "BROCHURE"
    | "CONNECTION_GUIDE"
    | "VIDEO"
    | "OTHER";
  fileUrl: string;
  thumbnailUrl?: string | null;
  language: "EN" | "HI";
  active: boolean;
  sortOrder: number;
  version?: string | null;
  effectiveDate?: string | null;
  product?:
    | { id: string; name: string; slug: string; modelNumber?: string }
    | null;
  variant?: { id: string; sku: string; hp?: string; phase?: string } | null;
}

export interface DemoMrkTestimonial {
  id: string;
  quote: string;
  name: string;
  city?: string | null;
  role: "DEALER" | "FARMER" | "HOMEOWNER" | "OTHER";
  active: boolean;
  sortOrder: number;
}

export interface DemoMrkSiteSetting {
  id: string;
  key: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  youtubeUrl?: string | null;
  businessHours?: Record<string, unknown> | null;
  statistics?: Record<string, unknown> | null;
  seoDefaults?: Record<string, unknown> | null;
  socialLinks?: Record<string, unknown> | null;
}

export interface DemoState {
  users: DemoUser[];
  carts: Record<string, DemoCart>;
  orders: DemoOrder[];
  products: DemoAdminProduct[];
  categories: DemoCategory[];
  attributes: DemoAttribute[];
  variants: DemoVariant[];
  transactions: DemoTransaction[];
  logs: DemoLog[];
  reviews: DemoReview[];
  mrkEnquiries: DemoMrkEnquiryLead[];
  mrkDealerApplications: DemoMrkDealerApplication[];
  mrkContactSubmissions: DemoMrkContactSubmission[];
  mrkDealers: DemoMrkDealer[];
  mrkDownloadAssets: DemoMrkDownloadAsset[];
  mrkTestimonials: DemoMrkTestimonial[];
  mrkSiteSetting: DemoMrkSiteSetting;
}
