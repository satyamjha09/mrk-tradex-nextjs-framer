import prisma from "@/infra/database/database.config";
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
import { DEALER_APPLICATION_STATUS, LEAD_STATUS, Prisma } from "@prisma/client";

export class MrkRepository {
  createEnquiryLead(data: CreateEnquiryLeadInput) {
    return prisma.enquiryLead.create({
      data: data as Prisma.EnquiryLeadUncheckedCreateInput,
    });
  }

  findEnquiryLeads() {
    return prisma.enquiryLead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, slug: true, modelNumber: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  updateEnquiryLeadStatus(id: string, status: LEAD_STATUS) {
    return prisma.enquiryLead.update({ where: { id }, data: { status } });
  }

  createDealerApplication(data: CreateDealerApplicationInput) {
    return prisma.dealerApplication.create({
      data: data as Prisma.DealerApplicationUncheckedCreateInput,
    });
  }

  findDealerApplications() {
    return prisma.dealerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  updateDealerApplicationStatus(id: string, status: DEALER_APPLICATION_STATUS) {
    return prisma.dealerApplication.update({ where: { id }, data: { status } });
  }

  createContactSubmission(data: CreateContactSubmissionInput) {
    return prisma.contactSubmission.create({
      data: data as Prisma.ContactSubmissionUncheckedCreateInput,
    });
  }

  findContactSubmissions() {
    return prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  updateContactSubmissionStatus(id: string, status: LEAD_STATUS) {
    return prisma.contactSubmission.update({ where: { id }, data: { status } });
  }

  findPublicDownloads() {
    return prisma.download.findMany({
      where: { isActive: true, isPublic: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        product: { select: { id: true, name: true, slug: true, modelNumber: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  findAllDownloads() {
    return prisma.download.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        product: { select: { id: true, name: true, slug: true, modelNumber: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  createDownload(data: CreateDownloadInput) {
    return prisma.download.create({
      data: data as Prisma.DownloadUncheckedCreateInput,
    });
  }

  findPublicDealers(filters: DealerFiltersInput = {}) {
    return prisma.dealer.findMany({
      where: {
        active: true,
        city: filters.city ? { equals: filters.city, mode: "insensitive" } : undefined,
        state: filters.state ? { equals: filters.state, mode: "insensitive" } : undefined,
      },
      orderBy: [{ featured: "desc" }, { city: "asc" }, { name: "asc" }],
    });
  }

  findAllDealers() {
    return prisma.dealer.findMany({
      orderBy: [{ active: "desc" }, { featured: "desc" }, { city: "asc" }],
    });
  }

  createDealer(data: CreateDealerInput) {
    return prisma.dealer.create({
      data: data as Prisma.DealerUncheckedCreateInput,
    });
  }

  updateDealer(id: string, data: UpdateDealerInput) {
    return prisma.dealer.update({
      where: { id },
      data: data as Prisma.DealerUncheckedUpdateInput,
    });
  }

  findPublicDownloadAssets() {
    return prisma.downloadAsset.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        product: { select: { id: true, name: true, slug: true, modelNumber: true } },
        variant: { select: { id: true, sku: true, hp: true, phase: true } },
      },
    });
  }

  findAllDownloadAssets() {
    return prisma.downloadAsset.findMany({
      orderBy: [{ active: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        product: { select: { id: true, name: true, slug: true, modelNumber: true } },
        variant: { select: { id: true, sku: true, hp: true, phase: true } },
      },
    });
  }

  createDownloadAsset(data: CreateDownloadAssetInput) {
    return prisma.downloadAsset.create({
      data: data as Prisma.DownloadAssetUncheckedCreateInput,
    });
  }

  updateDownloadAsset(id: string, data: UpdateDownloadAssetInput) {
    return prisma.downloadAsset.update({
      where: { id },
      data: data as Prisma.DownloadAssetUncheckedUpdateInput,
    });
  }

  findPublicTestimonials() {
    return prisma.testimonial.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  findAllTestimonials() {
    return prisma.testimonial.findMany({
      orderBy: [{ active: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  createTestimonial(data: CreateTestimonialInput) {
    return prisma.testimonial.create({
      data: data as Prisma.TestimonialUncheckedCreateInput,
    });
  }

  updateTestimonial(id: string, data: UpdateTestimonialInput) {
    return prisma.testimonial.update({
      where: { id },
      data: data as Prisma.TestimonialUncheckedUpdateInput,
    });
  }

  findSiteSetting(key = "global") {
    return prisma.siteSetting.findUnique({
      where: { key },
    });
  }

  upsertSiteSetting(data: SiteSettingInput) {
    const key = data.key || "global";
    return prisma.siteSetting.upsert({
      where: { key },
      update: data as Prisma.SiteSettingUncheckedUpdateInput,
      create: { ...data, key } as Prisma.SiteSettingUncheckedCreateInput,
    });
  }
}
