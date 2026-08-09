import express from "express";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import { makeMrkController } from "./mrk.factory";
import { requireFeature } from "@/shared/middlewares/requireFeature";

const router = express.Router();
const mrkController = makeMrkController();
const adminOnly = [protect, authorizeRole("ADMIN", "SUPERADMIN")];

router.get(
  "/downloads",
  requireFeature("downloadsEnabled"),
  mrkController.getPublicDownloads
);
router.get(
  "/download-assets",
  requireFeature("downloadsEnabled"),
  mrkController.getPublicDownloadAssets
);
router.get(
  "/dealers",
  requireFeature("dealerLocatorEnabled"),
  mrkController.getPublicDealers
);
router.get("/testimonials", mrkController.getPublicTestimonials);
router.get("/site-settings", mrkController.getSiteSetting);
router.post(
  "/enquiries",
  requireFeature("enquiryEnabled"),
  mrkController.createEnquiryLead
);
router.post(
  "/dealer-applications",
  requireFeature("dealerLocatorEnabled"),
  mrkController.createDealerApplication
);
router.post(
  "/contact-submissions",
  requireFeature("enquiryEnabled"),
  mrkController.createContactSubmission
);

router.get("/admin/enquiries", adminOnly, mrkController.getEnquiryLeads);
router.patch(
  "/admin/enquiries/:id/status",
  adminOnly,
  mrkController.updateEnquiryLeadStatus
);

router.get(
  "/admin/dealer-applications",
  adminOnly,
  mrkController.getDealerApplications
);
router.patch(
  "/admin/dealer-applications/:id/status",
  adminOnly,
  mrkController.updateDealerApplicationStatus
);

router.get(
  "/admin/contact-submissions",
  adminOnly,
  mrkController.getContactSubmissions
);
router.patch(
  "/admin/contact-submissions/:id/status",
  adminOnly,
  mrkController.updateContactSubmissionStatus
);

router.get(
  "/admin/downloads",
  adminOnly,
  requireFeature("downloadsEnabled"),
  mrkController.getAllDownloads
);
router.post(
  "/admin/downloads",
  adminOnly,
  requireFeature("downloadsEnabled"),
  mrkController.createDownload
);

router.get(
  "/admin/download-assets",
  adminOnly,
  requireFeature("downloadsEnabled"),
  mrkController.getAllDownloadAssets
);
router.post(
  "/admin/download-assets",
  adminOnly,
  requireFeature("downloadsEnabled"),
  mrkController.createDownloadAsset
);
router.patch(
  "/admin/download-assets/:id",
  adminOnly,
  requireFeature("downloadsEnabled"),
  mrkController.updateDownloadAsset
);

router.get(
  "/admin/dealers",
  adminOnly,
  requireFeature("dealerLocatorEnabled"),
  mrkController.getAllDealers
);
router.post(
  "/admin/dealers",
  adminOnly,
  requireFeature("dealerLocatorEnabled"),
  mrkController.createDealer
);
router.patch(
  "/admin/dealers/:id",
  adminOnly,
  requireFeature("dealerLocatorEnabled"),
  mrkController.updateDealer
);

router.get("/admin/testimonials", adminOnly, mrkController.getAllTestimonials);
router.post("/admin/testimonials", adminOnly, mrkController.createTestimonial);
router.patch(
  "/admin/testimonials/:id",
  adminOnly,
  mrkController.updateTestimonial
);

router.put("/admin/site-settings", adminOnly, mrkController.upsertSiteSetting);

export default router;
