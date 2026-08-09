// @ts-nocheck
import { apiSlice } from "../slices/ApiSlice";

export type MrkEnquiryPayload = {
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
  sourceType?:
    "PRODUCT" | "HOME" | "CONTACT" | "WHATSAPP" | "PHONE" | "DOWNLOAD";
  productId?: string;
  variantId?: string;
  categoryId?: string;
  metadata?: Record<string, unknown>;
};

export type MrkDealerApplicationPayload = {
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
  metadata?: Record<string, unknown>;
};

export type MrkLeadStatus =
  "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "SPAM";

export type MrkDealerApplicationStatus =
  "NEW" | "REVIEWING" | "APPROVED" | "REJECTED" | "ON_HOLD";

export type MrkEnquiryLead = MrkEnquiryPayload & {
  id: string;
  status: MrkLeadStatus;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    modelNumber?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type MrkDealerApplication = MrkDealerApplicationPayload & {
  id: string;
  status: MrkDealerApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type MrkContactSubmission = MrkContactSubmissionPayload & {
  id: string;
  status: MrkLeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type MrkContactSubmissionPayload = {
  name: string;
  message: string;
  type?: "CONTACT" | "FEEDBACK";
  phone?: string;
  mobile?: string;
  email?: string;
  subject?: string;
  city?: string;
  state?: string;
  metadata?: Record<string, unknown>;
};

export type MrkDealer = {
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
  featured: boolean;
  serviceAreas: string[];
  active?: boolean;
};

export type MrkDownloadAsset = {
  id: string;
  title: string;
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
  sortOrder: number;
  active?: boolean;
  version?: string | null;
  effectiveDate?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    modelNumber?: string | null;
  } | null;
  variant?: {
    id: string;
    sku: string;
    hp?: string | null;
    phase?: string | null;
  } | null;
};

export type MrkTestimonial = {
  id: string;
  quote: string;
  name: string;
  city?: string | null;
  role: "DEALER" | "FARMER" | "HOMEOWNER" | "OTHER";
  sortOrder: number;
  active?: boolean;
};

export type MrkDealerPayload = Omit<MrkDealer, "id">;
export type MrkDownloadAssetPayload = Omit<
  MrkDownloadAsset,
  "id" | "product" | "variant"
>;
export type MrkTestimonialPayload = Omit<MrkTestimonial, "id">;

export type MrkSiteSetting = {
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
};

export const mrkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMrkEnquiry: builder.mutation<unknown, MrkEnquiryPayload>({
      query: (body) => ({
        url: "/mrk/enquiries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
    createDealerApplication: builder.mutation<
      unknown,
      MrkDealerApplicationPayload
    >({
      query: (body) => ({
        url: "/mrk/dealer-applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
    createContactSubmission: builder.mutation<
      unknown,
      MrkContactSubmissionPayload
    >({
      query: (body) => ({
        url: "/mrk/contact-submissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
    getPublicDownloads: builder.query<{ downloads: unknown[] }, void>({
      query: () => ({
        url: "/mrk/downloads",
        method: "GET",
      }),
      providesTags: ["Mrk"],
    }),
    getPublicDownloadAssets: builder.query<
      { downloadAssets: MrkDownloadAsset[] },
      void
    >({
      query: () => ({
        url: "/mrk/download-assets",
        method: "GET",
      }),
      providesTags: ["Mrk"],
    }),
    getPublicDealers: builder.query<
      { dealers: MrkDealer[] },
      { city?: string; state?: string } | void
    >({
      query: (params) => ({
        url: "/mrk/dealers",
        method: "GET",
        params,
      }),
      providesTags: ["Mrk"],
    }),
    getPublicTestimonials: builder.query<
      { testimonials: MrkTestimonial[] },
      void
    >({
      query: () => ({
        url: "/mrk/testimonials",
        method: "GET",
      }),
      providesTags: ["Mrk"],
    }),
    getSiteSetting: builder.query<{ siteSetting: MrkSiteSetting | null }, void>(
      {
        query: () => ({
          url: "/mrk/site-settings",
          method: "GET",
        }),
        providesTags: ["Mrk"],
      },
    ),
    getAdminEnquiries: builder.query<{ enquiries: MrkEnquiryLead[] }, void>({
      query: () => ({ url: "/mrk/admin/enquiries", method: "GET" }),
      providesTags: ["Mrk"],
    }),
    updateAdminEnquiryStatus: builder.mutation<
      unknown,
      { id: string; status: MrkLeadStatus }
    >({
      query: ({ id, status }) => ({
        url: `/mrk/admin/enquiries/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Mrk"],
    }),
    getAdminDealerApplications: builder.query<
      { dealerApplications: MrkDealerApplication[] },
      void
    >({
      query: () => ({ url: "/mrk/admin/dealer-applications", method: "GET" }),
      providesTags: ["Mrk"],
    }),
    updateAdminDealerApplicationStatus: builder.mutation<
      unknown,
      { id: string; status: MrkDealerApplicationStatus }
    >({
      query: ({ id, status }) => ({
        url: `/mrk/admin/dealer-applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Mrk"],
    }),
    getAdminContactSubmissions: builder.query<
      { contactSubmissions: MrkContactSubmission[] },
      void
    >({
      query: () => ({ url: "/mrk/admin/contact-submissions", method: "GET" }),
      providesTags: ["Mrk"],
    }),
    updateAdminContactSubmissionStatus: builder.mutation<
      unknown,
      { id: string; status: MrkLeadStatus }
    >({
      query: ({ id, status }) => ({
        url: `/mrk/admin/contact-submissions/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Mrk"],
    }),
    getAdminDealers: builder.query<{ dealers: MrkDealer[] }, void>({
      query: () => ({ url: "/mrk/admin/dealers", method: "GET" }),
      providesTags: ["Mrk"],
    }),
    createAdminDealer: builder.mutation<unknown, MrkDealerPayload>({
      query: (body) => ({
        url: "/mrk/admin/dealers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
    getAdminDownloadAssets: builder.query<
      { downloadAssets: MrkDownloadAsset[] },
      void
    >({
      query: () => ({ url: "/mrk/admin/download-assets", method: "GET" }),
      providesTags: ["Mrk"],
    }),
    createAdminDownloadAsset: builder.mutation<
      unknown,
      MrkDownloadAssetPayload
    >({
      query: (body) => ({
        url: "/mrk/admin/download-assets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
    getAdminTestimonials: builder.query<
      { testimonials: MrkTestimonial[] },
      void
    >({
      query: () => ({ url: "/mrk/admin/testimonials", method: "GET" }),
      providesTags: ["Mrk"],
    }),
    createAdminTestimonial: builder.mutation<unknown, MrkTestimonialPayload>({
      query: (body) => ({
        url: "/mrk/admin/testimonials",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
    upsertAdminSiteSetting: builder.mutation<unknown, Partial<MrkSiteSetting>>({
      query: (body) => ({
        url: "/mrk/admin/site-settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Mrk"],
    }),
  }),
});

export const {
  useCreateMrkEnquiryMutation,
  useCreateDealerApplicationMutation,
  useCreateContactSubmissionMutation,
  useGetPublicDownloadsQuery,
  useGetPublicDownloadAssetsQuery,
  useGetPublicDealersQuery,
  useGetPublicTestimonialsQuery,
  useGetSiteSettingQuery,
  useGetAdminEnquiriesQuery,
  useUpdateAdminEnquiryStatusMutation,
  useGetAdminDealerApplicationsQuery,
  useUpdateAdminDealerApplicationStatusMutation,
  useGetAdminContactSubmissionsQuery,
  useUpdateAdminContactSubmissionStatusMutation,
  useGetAdminDealersQuery,
  useCreateAdminDealerMutation,
  useGetAdminDownloadAssetsQuery,
  useCreateAdminDownloadAssetMutation,
  useGetAdminTestimonialsQuery,
  useCreateAdminTestimonialMutation,
  useUpsertAdminSiteSettingMutation,
} = mrkApi;
