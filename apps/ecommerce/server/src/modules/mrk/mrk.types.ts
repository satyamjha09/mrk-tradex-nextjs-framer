import {
  CONTACT_SUBMISSION_TYPE,
  DEALER_APPLICATION_STATUS,
  DOWNLOAD_TYPE,
  ENQUIRY_SOURCE,
  LANGUAGE,
  LEAD_STATUS,
  TESTIMONIAL_TYPE,
} from "@prisma/client";

export type CreateEnquiryLeadInput = {
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
  sourceType?: ENQUIRY_SOURCE;
  preferredDealer?: string;
  language?: LANGUAGE;
  productId?: string;
  variantId?: string;
  categoryId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
};

export type CreateDealerApplicationInput = {
  name: string;
  businessName: string;
  address: string;
  mobile: string;
  city?: string;
  state?: string;
  pincode?: string;
  whatsapp?: string;
  email?: string;
  gstNumber?: string;
  currentBusiness?: string;
  productCategories?: string[];
  experience?: string;
  message?: string;
  language?: LANGUAGE;
  metadata?: Record<string, unknown>;
};

export type CreateContactSubmissionInput = {
  name: string;
  message: string;
  type?: CONTACT_SUBMISSION_TYPE;
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  subject?: string;
  city?: string;
  state?: string;
  language?: LANGUAGE;
  metadata?: Record<string, unknown>;
};

export type CreateDownloadInput = {
  title: string;
  slug: string;
  type: DOWNLOAD_TYPE;
  fileUrl: string;
  description?: string;
  thumbnailUrl?: string;
  language?: LANGUAGE;
  isPublic?: boolean;
  requiresLead?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  productId?: string;
  variantId?: string;
  categoryId?: string;
  version?: string;
  effectiveDate?: Date;
  translations?: Record<string, unknown>;
};

export type CreateDealerInput = {
  name: string;
  businessName?: string;
  contactPerson?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
  featured?: boolean;
  serviceAreas?: string[];
};

export type UpdateDealerInput = Partial<CreateDealerInput>;

export type CreateDownloadAssetInput = {
  title: string;
  slug: string;
  type: DOWNLOAD_TYPE;
  fileUrl: string;
  description?: string;
  thumbnailUrl?: string;
  productId?: string;
  variantId?: string;
  language?: LANGUAGE;
  active?: boolean;
  sortOrder?: number;
  version?: string;
  effectiveDate?: Date;
};

export type UpdateDownloadAssetInput = Partial<CreateDownloadAssetInput>;

export type CreateTestimonialInput = {
  quote: string;
  name: string;
  city?: string;
  role?: TESTIMONIAL_TYPE;
  active?: boolean;
  sortOrder?: number;
};

export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

export type SiteSettingInput = {
  key?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  youtubeUrl?: string;
  businessHours?: Record<string, unknown>;
  statistics?: Record<string, unknown>;
  seoDefaults?: Record<string, unknown>;
  socialLinks?: Record<string, unknown>;
};

export type DealerFiltersInput = {
  city?: string;
  state?: string;
};

export type LeadStatusInput = {
  status: LEAD_STATUS;
};

export type DealerApplicationStatusInput = {
  status: DEALER_APPLICATION_STATUS;
};
