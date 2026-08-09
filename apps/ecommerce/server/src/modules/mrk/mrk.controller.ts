import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { MrkService } from "./mrk.service";

export class MrkController {
  constructor(private mrkService: MrkService) {}

  createEnquiryLead = asyncHandler(async (req: Request, res: Response) => {
    const enquiry = await this.mrkService.createEnquiryLead(req.body);
    sendResponse(res, 201, {
      data: { enquiry },
      message: "Enquiry submitted successfully",
    });
  });

  getEnquiryLeads = asyncHandler(async (_req: Request, res: Response) => {
    const enquiries = await this.mrkService.getEnquiryLeads();
    sendResponse(res, 200, {
      data: { enquiries },
      message: "Enquiries fetched successfully",
    });
  });

  updateEnquiryLeadStatus = asyncHandler(async (req: Request, res: Response) => {
    const enquiry = await this.mrkService.updateEnquiryLeadStatus(
      req.params.id,
      req.body.status
    );
    sendResponse(res, 200, {
      data: { enquiry },
      message: "Enquiry status updated successfully",
    });
  });

  createDealerApplication = asyncHandler(async (req: Request, res: Response) => {
    const dealerApplication = await this.mrkService.createDealerApplication(
      req.body
    );
    sendResponse(res, 201, {
      data: { dealerApplication },
      message: "Dealer application submitted successfully",
    });
  });

  getDealerApplications = asyncHandler(async (_req: Request, res: Response) => {
    const dealerApplications = await this.mrkService.getDealerApplications();
    sendResponse(res, 200, {
      data: { dealerApplications },
      message: "Dealer applications fetched successfully",
    });
  });

  updateDealerApplicationStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const dealerApplication =
        await this.mrkService.updateDealerApplicationStatus(
          req.params.id,
          req.body.status
        );
      sendResponse(res, 200, {
        data: { dealerApplication },
        message: "Dealer application status updated successfully",
      });
    }
  );

  createContactSubmission = asyncHandler(async (req: Request, res: Response) => {
    const contactSubmission = await this.mrkService.createContactSubmission(
      req.body
    );
    sendResponse(res, 201, {
      data: { contactSubmission },
      message: "Contact request submitted successfully",
    });
  });

  getContactSubmissions = asyncHandler(async (_req: Request, res: Response) => {
    const contactSubmissions = await this.mrkService.getContactSubmissions();
    sendResponse(res, 200, {
      data: { contactSubmissions },
      message: "Contact submissions fetched successfully",
    });
  });

  updateContactSubmissionStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const contactSubmission =
        await this.mrkService.updateContactSubmissionStatus(
          req.params.id,
          req.body.status
        );
      sendResponse(res, 200, {
        data: { contactSubmission },
        message: "Contact submission status updated successfully",
      });
    }
  );

  getPublicDownloads = asyncHandler(async (_req: Request, res: Response) => {
    const downloads = await this.mrkService.getPublicDownloads();
    sendResponse(res, 200, {
      data: { downloads },
      message: "Downloads fetched successfully",
    });
  });

  getAllDownloads = asyncHandler(async (_req: Request, res: Response) => {
    const downloads = await this.mrkService.getAllDownloads();
    sendResponse(res, 200, {
      data: { downloads },
      message: "Downloads fetched successfully",
    });
  });

  createDownload = asyncHandler(async (req: Request, res: Response) => {
    const download = await this.mrkService.createDownload(req.body);
    sendResponse(res, 201, {
      data: { download },
      message: "Download created successfully",
    });
  });

  getPublicDealers = asyncHandler(async (req: Request, res: Response) => {
    const dealers = await this.mrkService.getPublicDealers({
      city: req.query.city as string | undefined,
      state: req.query.state as string | undefined,
    });
    sendResponse(res, 200, {
      data: { dealers },
      message: "Dealers fetched successfully",
    });
  });

  getAllDealers = asyncHandler(async (_req: Request, res: Response) => {
    const dealers = await this.mrkService.getAllDealers();
    sendResponse(res, 200, {
      data: { dealers },
      message: "Dealers fetched successfully",
    });
  });

  createDealer = asyncHandler(async (req: Request, res: Response) => {
    const dealer = await this.mrkService.createDealer(req.body);
    sendResponse(res, 201, {
      data: { dealer },
      message: "Dealer created successfully",
    });
  });

  updateDealer = asyncHandler(async (req: Request, res: Response) => {
    const dealer = await this.mrkService.updateDealer(req.params.id, req.body);
    sendResponse(res, 200, {
      data: { dealer },
      message: "Dealer updated successfully",
    });
  });

  getPublicDownloadAssets = asyncHandler(
    async (_req: Request, res: Response) => {
      const downloadAssets = await this.mrkService.getPublicDownloadAssets();
      sendResponse(res, 200, {
        data: { downloadAssets },
        message: "Download assets fetched successfully",
      });
    }
  );

  getAllDownloadAssets = asyncHandler(async (_req: Request, res: Response) => {
    const downloadAssets = await this.mrkService.getAllDownloadAssets();
    sendResponse(res, 200, {
      data: { downloadAssets },
      message: "Download assets fetched successfully",
    });
  });

  createDownloadAsset = asyncHandler(async (req: Request, res: Response) => {
    const downloadAsset = await this.mrkService.createDownloadAsset(req.body);
    sendResponse(res, 201, {
      data: { downloadAsset },
      message: "Download asset created successfully",
    });
  });

  updateDownloadAsset = asyncHandler(async (req: Request, res: Response) => {
    const downloadAsset = await this.mrkService.updateDownloadAsset(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, {
      data: { downloadAsset },
      message: "Download asset updated successfully",
    });
  });

  getPublicTestimonials = asyncHandler(
    async (_req: Request, res: Response) => {
      const testimonials = await this.mrkService.getPublicTestimonials();
      sendResponse(res, 200, {
        data: { testimonials },
        message: "Testimonials fetched successfully",
      });
    }
  );

  getAllTestimonials = asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await this.mrkService.getAllTestimonials();
    sendResponse(res, 200, {
      data: { testimonials },
      message: "Testimonials fetched successfully",
    });
  });

  createTestimonial = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await this.mrkService.createTestimonial(req.body);
    sendResponse(res, 201, {
      data: { testimonial },
      message: "Testimonial created successfully",
    });
  });

  updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await this.mrkService.updateTestimonial(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, {
      data: { testimonial },
      message: "Testimonial updated successfully",
    });
  });

  getSiteSetting = asyncHandler(async (req: Request, res: Response) => {
    const siteSetting = await this.mrkService.getSiteSetting(
      req.query.key as string | undefined
    );
    sendResponse(res, 200, {
      data: { siteSetting },
      message: "Site setting fetched successfully",
    });
  });

  upsertSiteSetting = asyncHandler(async (req: Request, res: Response) => {
    const siteSetting = await this.mrkService.upsertSiteSetting(req.body);
    sendResponse(res, 200, {
      data: { siteSetting },
      message: "Site setting saved successfully",
    });
  });
}
