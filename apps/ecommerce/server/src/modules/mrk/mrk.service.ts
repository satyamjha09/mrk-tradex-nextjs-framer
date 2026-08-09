import {
  CONTACT_SUBMISSION_TYPE,
  DEALER_APPLICATION_STATUS,
  DOWNLOAD_TYPE,
  ENQUIRY_SOURCE,
  LANGUAGE,
  LEAD_STATUS,
  TESTIMONIAL_TYPE,
} from "@prisma/client";
import AppError from "@/shared/errors/AppError";
import { MrkRepository } from "./mrk.repository";
import {
  CreateContactSubmissionInput,
  CreateDealerInput,
  CreateDealerApplicationInput,
  CreateDownloadAssetInput,
  CreateDownloadInput,
  CreateEnquiryLeadInput,
  CreateTestimonialInput,
  DealerFiltersInput,
  SiteSettingInput,
  UpdateDealerInput,
  UpdateDownloadAssetInput,
  UpdateTestimonialInput,
} from "./mrk.types";

export class MrkService {
  constructor(private mrkRepository: MrkRepository) {}

  async createEnquiryLead(data: CreateEnquiryLeadInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.name, "Name is required");
    this.requireText(cleanData.phone, "Phone is required");
    this.validatePhone(cleanData.phone, "Phone");
    this.validatePhone(cleanData.mobile, "Mobile");
    this.validatePhone(cleanData.whatsapp, "WhatsApp");
    this.validateEmail(cleanData.email);
    this.validatePincode(cleanData.pincode);

    return this.mrkRepository.createEnquiryLead({
      ...cleanData,
      source: cleanData.source || "website",
      sourceType: this.normalizeEnum(
        cleanData.sourceType,
        ENQUIRY_SOURCE,
        ENQUIRY_SOURCE.CONTACT
      ),
      language: this.normalizeEnum(cleanData.language, LANGUAGE, LANGUAGE.EN),
    });
  }

  getEnquiryLeads() {
    return this.mrkRepository.findEnquiryLeads();
  }

  updateEnquiryLeadStatus(id: string, status: LEAD_STATUS) {
    return this.mrkRepository.updateEnquiryLeadStatus(
      id,
      this.normalizeEnum(status, LEAD_STATUS, LEAD_STATUS.NEW)
    );
  }

  async createDealerApplication(data: CreateDealerApplicationInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.name, "Name is required");
    this.requireText(cleanData.businessName, "Business name is required");
    this.requireText(cleanData.mobile, "Mobile number is required");
    this.requireText(cleanData.address, "Address is required");
    this.validatePhone(cleanData.mobile, "Mobile");
    this.validatePhone(cleanData.whatsapp, "WhatsApp");
    this.validateEmail(cleanData.email);
    this.validatePincode(cleanData.pincode);
    this.validateGst(cleanData.gstNumber);

    return this.mrkRepository.createDealerApplication({
      ...cleanData,
      language: this.normalizeEnum(cleanData.language, LANGUAGE, LANGUAGE.EN),
    });
  }

  getDealerApplications() {
    return this.mrkRepository.findDealerApplications();
  }

  updateDealerApplicationStatus(
    id: string,
    status: DEALER_APPLICATION_STATUS
  ) {
    return this.mrkRepository.updateDealerApplicationStatus(
      id,
      this.normalizeEnum(
        status,
        DEALER_APPLICATION_STATUS,
        DEALER_APPLICATION_STATUS.NEW
      )
    );
  }

  async createContactSubmission(data: CreateContactSubmissionInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.name, "Name is required");
    this.requireText(cleanData.message, "Message is required");
    this.validatePhone(cleanData.phone, "Phone");
    this.validatePhone(cleanData.mobile, "Mobile");
    this.validateEmail(cleanData.email);

    return this.mrkRepository.createContactSubmission({
      ...cleanData,
      type: this.normalizeEnum(
        cleanData.type,
        CONTACT_SUBMISSION_TYPE,
        CONTACT_SUBMISSION_TYPE.CONTACT
      ),
      language: this.normalizeEnum(cleanData.language, LANGUAGE, LANGUAGE.EN),
    });
  }

  getContactSubmissions() {
    return this.mrkRepository.findContactSubmissions();
  }

  updateContactSubmissionStatus(id: string, status: LEAD_STATUS) {
    return this.mrkRepository.updateContactSubmissionStatus(
      id,
      this.normalizeEnum(status, LEAD_STATUS, LEAD_STATUS.NEW)
    );
  }

  getPublicDownloads() {
    return this.mrkRepository.findPublicDownloads();
  }

  getAllDownloads() {
    return this.mrkRepository.findAllDownloads();
  }

  async createDownload(data: CreateDownloadInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.title, "Title is required");
    this.requireText(cleanData.slug, "Slug is required");
    this.requireText(cleanData.fileUrl, "File URL is required");
    this.validateUrl(cleanData.fileUrl, "File URL");
    this.validateUrl(cleanData.thumbnailUrl, "Thumbnail URL");

    return this.mrkRepository.createDownload({
      ...cleanData,
      type: this.normalizeEnum(cleanData.type, DOWNLOAD_TYPE, DOWNLOAD_TYPE.OTHER),
      language: this.normalizeEnum(cleanData.language, LANGUAGE, LANGUAGE.EN),
      isPublic: cleanData.isPublic ?? true,
      requiresLead: cleanData.requiresLead ?? false,
      isActive: cleanData.isActive ?? true,
      sortOrder: cleanData.sortOrder ?? 0,
    });
  }

  getPublicDealers(filters: DealerFiltersInput) {
    return this.mrkRepository.findPublicDealers(this.clean(filters));
  }

  getAllDealers() {
    return this.mrkRepository.findAllDealers();
  }

  async createDealer(data: CreateDealerInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.name, "Dealer name is required");
    this.requireText(cleanData.phone, "Dealer phone is required");
    this.requireText(cleanData.address, "Dealer address is required");
    this.requireText(cleanData.city, "Dealer city is required");
    this.requireText(cleanData.state, "Dealer state is required");
    this.requireText(cleanData.pincode, "Dealer pincode is required");
    this.validatePhone(cleanData.phone, "Dealer phone");
    this.validatePhone(cleanData.whatsapp, "WhatsApp");
    this.validateEmail(cleanData.email);
    this.validatePincode(cleanData.pincode);

    return this.mrkRepository.createDealer({
      ...cleanData,
      active: cleanData.active ?? true,
      featured: cleanData.featured ?? false,
      serviceAreas: cleanData.serviceAreas ?? [],
    });
  }

  updateDealer(id: string, data: UpdateDealerInput) {
    const cleanData = this.clean(data);
    this.validatePhone(cleanData.phone, "Dealer phone");
    this.validatePhone(cleanData.whatsapp, "WhatsApp");
    this.validateEmail(cleanData.email);
    this.validatePincode(cleanData.pincode);
    return this.mrkRepository.updateDealer(id, cleanData);
  }

  getPublicDownloadAssets() {
    return this.mrkRepository.findPublicDownloadAssets();
  }

  getAllDownloadAssets() {
    return this.mrkRepository.findAllDownloadAssets();
  }

  async createDownloadAsset(data: CreateDownloadAssetInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.title, "Download asset title is required");
    this.requireText(cleanData.slug, "Download asset slug is required");
    this.requireText(cleanData.fileUrl, "Download asset file URL is required");
    this.validateUrl(cleanData.fileUrl, "Download asset file URL");
    this.validateUrl(cleanData.thumbnailUrl, "Thumbnail URL");

    return this.mrkRepository.createDownloadAsset({
      ...cleanData,
      type: this.normalizeEnum(cleanData.type, DOWNLOAD_TYPE, DOWNLOAD_TYPE.OTHER),
      language: this.normalizeEnum(cleanData.language, LANGUAGE, LANGUAGE.EN),
      active: cleanData.active ?? true,
      sortOrder: cleanData.sortOrder ?? 0,
    });
  }

  updateDownloadAsset(id: string, data: UpdateDownloadAssetInput) {
    const cleanData = this.clean(data);
    this.validateUrl(cleanData.fileUrl, "Download asset file URL");
    this.validateUrl(cleanData.thumbnailUrl, "Thumbnail URL");
    return this.mrkRepository.updateDownloadAsset(id, {
      ...cleanData,
      ...(cleanData.type
        ? { type: this.normalizeEnum(cleanData.type, DOWNLOAD_TYPE, DOWNLOAD_TYPE.OTHER) }
        : {}),
      ...(cleanData.language
        ? { language: this.normalizeEnum(cleanData.language, LANGUAGE, LANGUAGE.EN) }
        : {}),
    });
  }

  getPublicTestimonials() {
    return this.mrkRepository.findPublicTestimonials();
  }

  getAllTestimonials() {
    return this.mrkRepository.findAllTestimonials();
  }

  async createTestimonial(data: CreateTestimonialInput) {
    const cleanData = this.clean(data);
    this.requireText(cleanData.quote, "Testimonial quote is required");
    this.requireText(cleanData.name, "Testimonial name is required");

    return this.mrkRepository.createTestimonial({
      ...cleanData,
      role: this.normalizeEnum(cleanData.role, TESTIMONIAL_TYPE, TESTIMONIAL_TYPE.OTHER),
      active: cleanData.active ?? true,
      sortOrder: cleanData.sortOrder ?? 0,
    });
  }

  updateTestimonial(id: string, data: UpdateTestimonialInput) {
    const cleanData = this.clean(data);
    return this.mrkRepository.updateTestimonial(id, {
      ...cleanData,
      ...(cleanData.role
        ? { role: this.normalizeEnum(cleanData.role, TESTIMONIAL_TYPE, TESTIMONIAL_TYPE.OTHER) }
        : {}),
    });
  }

  getSiteSetting(key?: string) {
    return this.mrkRepository.findSiteSetting(key || "global");
  }

  upsertSiteSetting(data: SiteSettingInput) {
    const cleanData = this.clean(data);
    this.validateSiteSetting(cleanData);
    return this.mrkRepository.upsertSiteSetting(cleanData);
  }

  private requireText(value: unknown, message: string) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(400, message);
    }
  }

  private validatePhone(value: string | undefined, label: string) {
    if (!value) return;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      throw new AppError(400, `${label} must contain 7 to 15 digits`);
    }
  }

  private validateEmail(value: string | undefined) {
    if (!value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new AppError(400, "Email format is invalid");
    }
  }

  private validatePincode(value: string | undefined) {
    if (!value) return;
    if (!/^\d{6}$/.test(value)) {
      throw new AppError(400, "Pincode must be a 6 digit Indian pincode");
    }
  }

  private validateUrl(value: string | undefined, label: string) {
    if (!value) return;
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Unsupported protocol");
      }
    } catch {
      throw new AppError(400, `${label} must be a valid HTTP or HTTPS URL`);
    }
  }

  private validateGst(value: string | undefined) {
    if (!value) return;
    const gstPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;
    if (!gstPattern.test(value)) {
      throw new AppError(400, "GST number format is invalid");
    }
  }

  private validateSiteSetting(data: SiteSettingInput) {
    if (data.key && !/^[a-z0-9_-]+$/i.test(data.key)) {
      throw new AppError(400, "Site setting key format is invalid");
    }
    this.validatePhone(data.phone, "Phone");
    this.validatePhone(data.whatsapp, "WhatsApp");
    this.validateEmail(data.email);
    this.validateGst(data.gstNumber);
    this.validateUrl(data.youtubeUrl, "YouTube URL");
  }

  private normalizeEnum<T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T,
    fallback: T[keyof T]
  ): T[keyof T];
  private normalizeEnum<T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T,
    fallback: undefined
  ): T[keyof T] | undefined;
  private normalizeEnum<T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T,
    fallback: T[keyof T] | undefined
  ): T[keyof T] | undefined {
    return value && Object.values(enumObject).includes(value)
      ? (value as T[keyof T])
      : fallback;
  }

  private clean<T extends Record<string, any>>(data: T): T {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) acc[key as keyof T] = trimmed as T[keyof T];
      } else if (value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as T);
  }
}
