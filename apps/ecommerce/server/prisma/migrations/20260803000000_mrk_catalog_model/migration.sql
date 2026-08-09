-- CreateEnum
CREATE TYPE "PRODUCT_CATEGORY_KIND" AS ENUM ('SINGLE_PHASE_STARTER', 'THREE_PHASE_PANEL', 'WLC_SMART_PLUG', 'CABLE_ACCESSORY');

-- CreateEnum
CREATE TYPE "PRODUCT_PHASE" AS ENUM ('SINGLE_PHASE', 'THREE_PHASE', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "DOWNLOAD_TYPE" AS ENUM ('CATALOG', 'PRICE_LIST', 'MANUAL', 'VIDEO', 'OTHER');

-- CreateEnum
CREATE TYPE "LANGUAGE" AS ENUM ('EN', 'HI');

-- CreateEnum
CREATE TYPE "LEAD_STATUS" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'SPAM');

-- CreateEnum
CREATE TYPE "CONTACT_SUBMISSION_TYPE" AS ENUM ('CONTACT', 'FEEDBACK');

-- CreateEnum
CREATE TYPE "CONTENT_BLOCK_TYPE" AS ENUM ('GLOBAL', 'PAGE', 'SECTION');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "modelNumber" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "productLine" TEXT,
ADD COLUMN     "phase" "PRODUCT_PHASE",
ADD COLUMN     "hp" TEXT,
ADD COLUMN     "boxType" TEXT,
ADD COLUMN     "meterType" TEXT,
ADD COLUMN     "startCapacitor" TEXT,
ADD COLUMN     "runCapacitor" TEXT,
ADD COLUMN     "capacitor" TEXT,
ADD COLUMN     "maxLoad" TEXT,
ADD COLUMN     "mcbRelayOlp" TEXT,
ADD COLUMN     "warranty" TEXT,
ADD COLUMN     "mrp" DECIMAL(10,2),
ADD COLUMN     "voltage" TEXT,
ADD COLUMN     "ampRating" TEXT,
ADD COLUMN     "suitableFor" TEXT,
ADD COLUMN     "protectionFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "specSheet" JSONB,
ADD COLUMN     "manualUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "translations" JSONB,
ADD COLUMN     "isCatalogVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enquiryEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "kind" "PRODUCT_CATEGORY_KIND",
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "translations" JSONB,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "DOWNLOAD_TYPE" NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "language" "LANGUAGE" NOT NULL DEFAULT 'EN',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "requiresLead" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT,
    "categoryId" TEXT,
    "translations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnquiryLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "state" TEXT,
    "message" TEXT,
    "source" TEXT,
    "status" "LEAD_STATUS" NOT NULL DEFAULT 'NEW',
    "preferredDealer" TEXT,
    "language" "LANGUAGE" NOT NULL DEFAULT 'EN',
    "productId" TEXT,
    "categoryId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnquiryLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealerApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "gstNumber" TEXT,
    "message" TEXT,
    "status" "LEAD_STATUS" NOT NULL DEFAULT 'NEW',
    "language" "LANGUAGE" NOT NULL DEFAULT 'EN',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "type" "CONTACT_SUBMISSION_TYPE" NOT NULL DEFAULT 'CONTACT',
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "status" "LEAD_STATUS" NOT NULL DEFAULT 'NEW',
    "language" "LANGUAGE" NOT NULL DEFAULT 'EN',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteContentBlock" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "CONTENT_BLOCK_TYPE" NOT NULL DEFAULT 'SECTION',
    "page" TEXT,
    "section" TEXT,
    "title" TEXT,
    "body" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "mediaUrl" TEXT,
    "language" "LANGUAGE" NOT NULL DEFAULT 'EN',
    "translations" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_modelNumber_idx" ON "Product"("modelNumber");

-- CreateIndex
CREATE INDEX "Product_categoryId_isCatalogVisible_sortOrder_idx" ON "Product"("categoryId", "isCatalogVisible", "sortOrder");

-- CreateIndex
CREATE INDEX "Category_kind_isVisible_sortOrder_idx" ON "Category"("kind", "isVisible", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Download_slug_key" ON "Download"("slug");

-- CreateIndex
CREATE INDEX "Download_type_language_isActive_idx" ON "Download"("type", "language", "isActive");

-- CreateIndex
CREATE INDEX "Download_productId_categoryId_idx" ON "Download"("productId", "categoryId");

-- CreateIndex
CREATE INDEX "EnquiryLead_status_createdAt_idx" ON "EnquiryLead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "EnquiryLead_phone_idx" ON "EnquiryLead"("phone");

-- CreateIndex
CREATE INDEX "EnquiryLead_productId_categoryId_idx" ON "EnquiryLead"("productId", "categoryId");

-- CreateIndex
CREATE INDEX "DealerApplication_status_createdAt_idx" ON "DealerApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DealerApplication_mobile_idx" ON "DealerApplication"("mobile");

-- CreateIndex
CREATE INDEX "ContactSubmission_type_status_createdAt_idx" ON "ContactSubmission"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_email_idx" ON "ContactSubmission"("email");

-- CreateIndex
CREATE INDEX "ContactSubmission_phone_idx" ON "ContactSubmission"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteContentBlock_key_language_key" ON "WebsiteContentBlock"("key", "language");

-- CreateIndex
CREATE INDEX "WebsiteContentBlock_page_section_language_isActive_idx" ON "WebsiteContentBlock"("page", "section", "language", "isActive");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryLead" ADD CONSTRAINT "EnquiryLead_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryLead" ADD CONSTRAINT "EnquiryLead_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
