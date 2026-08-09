-- CreateEnum
CREATE TYPE "ENQUIRY_SOURCE" AS ENUM ('PRODUCT', 'HOME', 'CONTACT', 'WHATSAPP', 'PHONE', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "DEALER_APPLICATION_STATUS" AS ENUM ('NEW', 'REVIEWING', 'APPROVED', 'REJECTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "METER_DISPLAY_TYPE" AS ENUM ('ANALOG', 'DIGITAL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "TESTIMONIAL_TYPE" AS ENUM ('DEALER', 'FARMER', 'HOMEOWNER', 'OTHER');

-- AlterEnum
ALTER TYPE "DOWNLOAD_TYPE" ADD VALUE 'BROCHURE';
ALTER TYPE "DOWNLOAD_TYPE" ADD VALUE 'CONNECTION_GUIDE';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "productSeries" TEXT,
ADD COLUMN     "useCases" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuredVideoUrl" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "priceVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stockVisible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hp" TEXT,
ADD COLUMN     "hpMin" DOUBLE PRECISION,
ADD COLUMN     "hpMax" DOUBLE PRECISION,
ADD COLUMN     "phase" "PRODUCT_PHASE",
ADD COLUMN     "variantType" TEXT,
ADD COLUMN     "maxLoadAmps" DOUBLE PRECISION,
ADD COLUMN     "boxType" TEXT,
ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "meterType" TEXT,
ADD COLUMN     "meterDisplayType" "METER_DISPLAY_TYPE",
ADD COLUMN     "meterSize" TEXT,
ADD COLUMN     "startCapacitor" TEXT,
ADD COLUMN     "runCapacitor" TEXT,
ADD COLUMN     "mcbRelayOlp" TEXT,
ADD COLUMN     "warranty" TEXT,
ADD COLUMN     "protectionFeatures" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "installationInfo" JSONB,
ADD COLUMN     "manualUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Download" ADD COLUMN     "variantId" TEXT,
ADD COLUMN     "version" TEXT,
ADD COLUMN     "effectiveDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EnquiryLead" ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "whatsapp" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "sourceType" "ENQUIRY_SOURCE" NOT NULL DEFAULT 'CONTACT',
ADD COLUMN     "variantId" TEXT,
ADD COLUMN     "assignedAdminId" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmTerm" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "referrer" TEXT;

-- AlterTable
ALTER TABLE "DealerApplication" ADD COLUMN     "whatsapp" TEXT,
ADD COLUMN     "currentBusiness" TEXT,
ADD COLUMN     "productCategories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "legacyLeadStatus" "LEAD_STATUS",
ADD COLUMN     "assignedAdminId" TEXT,
ADD COLUMN     "internalNotes" TEXT;

UPDATE "DealerApplication"
SET "legacyLeadStatus" = "status";

ALTER TABLE "DealerApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "DealerApplication" ALTER COLUMN "status" TYPE "DEALER_APPLICATION_STATUS"
USING (
  CASE "status"::text
    WHEN 'NEW' THEN 'NEW'
    WHEN 'CONTACTED' THEN 'REVIEWING'
    WHEN 'QUALIFIED' THEN 'APPROVED'
    WHEN 'CLOSED' THEN 'APPROVED'
    WHEN 'SPAM' THEN 'REJECTED'
    ELSE 'NEW'
  END
)::"DEALER_APPLICATION_STATUS";
ALTER TABLE "DealerApplication" ALTER COLUMN "status" SET DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "address" TEXT,
ADD COLUMN     "mobile" TEXT;

-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT,
    "contactPerson" TEXT,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "serviceAreas" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadAsset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "DOWNLOAD_TYPE" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "productId" TEXT,
    "variantId" TEXT,
    "language" "LANGUAGE" NOT NULL DEFAULT 'EN',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "version" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownloadAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "role" "TESTIMONIAL_TYPE" NOT NULL DEFAULT 'OTHER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'global',
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "gstNumber" TEXT,
    "youtubeUrl" TEXT,
    "businessHours" JSONB,
    "statistics" JSONB,
    "seoDefaults" JSONB,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_categoryId_isActive_isPublished_sortOrder_idx" ON "Product"("categoryId", "isActive", "isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_productSeries_idx" ON "Product"("productSeries");

-- CreateIndex
CREATE INDEX "Product_phase_idx" ON "Product"("phase");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_isActive_sortOrder_idx" ON "ProductVariant"("productId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductVariant_phase_idx" ON "ProductVariant"("phase");

-- CreateIndex
CREATE INDEX "ProductVariant_hpMin_hpMax_idx" ON "ProductVariant"("hpMin", "hpMax");

-- CreateIndex
CREATE INDEX "Dealer_active_featured_idx" ON "Dealer"("active", "featured");

-- CreateIndex
CREATE INDEX "Dealer_city_state_idx" ON "Dealer"("city", "state");

-- CreateIndex
CREATE INDEX "Dealer_pincode_idx" ON "Dealer"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadAsset_slug_key" ON "DownloadAsset"("slug");

-- CreateIndex
CREATE INDEX "DownloadAsset_type_language_active_idx" ON "DownloadAsset"("type", "language", "active");

-- CreateIndex
CREATE INDEX "DownloadAsset_productId_variantId_idx" ON "DownloadAsset"("productId", "variantId");

-- CreateIndex
CREATE INDEX "DownloadAsset_active_sortOrder_idx" ON "DownloadAsset"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_role_active_sortOrder_idx" ON "Testimonial"("role", "active", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "Download_productId_variantId_categoryId_idx" ON "Download"("productId", "variantId", "categoryId");

-- CreateIndex
CREATE INDEX "EnquiryLead_sourceType_createdAt_idx" ON "EnquiryLead"("sourceType", "createdAt");

-- CreateIndex
CREATE INDEX "EnquiryLead_assignedAdminId_idx" ON "EnquiryLead"("assignedAdminId");

-- CreateIndex
CREATE INDEX "EnquiryLead_productId_variantId_categoryId_idx" ON "EnquiryLead"("productId", "variantId", "categoryId");

-- CreateIndex
CREATE INDEX "EnquiryLead_city_state_idx" ON "EnquiryLead"("city", "state");

-- CreateIndex
CREATE INDEX "DealerApplication_assignedAdminId_idx" ON "DealerApplication"("assignedAdminId");

-- CreateIndex
CREATE INDEX "ContactSubmission_mobile_idx" ON "ContactSubmission"("mobile");

-- DropIndex
DROP INDEX IF EXISTS "Download_productId_categoryId_idx";

-- DropIndex
DROP INDEX IF EXISTS "EnquiryLead_productId_categoryId_idx";

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryLead" ADD CONSTRAINT "EnquiryLead_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryLead" ADD CONSTRAINT "EnquiryLead_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealerApplication" ADD CONSTRAINT "DealerApplication_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadAsset" ADD CONSTRAINT "DownloadAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadAsset" ADD CONSTRAINT "DownloadAsset_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
