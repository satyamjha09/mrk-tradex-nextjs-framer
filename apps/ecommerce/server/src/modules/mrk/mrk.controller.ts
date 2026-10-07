import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import sendEmail from "@/shared/utils/sendEmail";
import { MrkService } from "./mrk.service";

const escapeHtml = (value: unknown) =>
  String(value ?? "—").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] as string
  );

const isValidEmail = (value: unknown) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const cleanRows = (rows: [string, unknown][]) =>
  rows.filter(([, value]) => value !== undefined && value !== null && value !== "");

const renderConfirmationEmail = ({
  eyebrow,
  title,
  intro,
  rows,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  rows: [string, unknown][];
}) => {
  const visibleRows = cleanRows(rows);
  const text = [
    title,
    "",
    intro,
    "",
    ...visibleRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Our team will review this and get back to you soon.",
    "MRK Tradex Pvt Ltd",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f4f8fb;font-family:Arial,Helvetica,sans-serif;color:#0b1f33">
      <div style="max-width:640px;margin:0 auto;padding:28px 16px">
        <div style="overflow:hidden;border-radius:22px;background:#ffffff;border:1px solid #dce6f0;box-shadow:0 18px 45px rgba(11,31,51,0.10)">
          <div style="background:#0b1f33;padding:26px 28px;color:#ffffff">
            <div style="display:inline-block;border-radius:999px;background:#1e9be0;padding:6px 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">
              ${escapeHtml(eyebrow)}
            </div>
            <h1 style="margin:16px 0 0;font-size:26px;line-height:1.25;font-weight:800">
              ${escapeHtml(title)}
            </h1>
          </div>
          <div style="padding:28px">
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#334e68">
              ${escapeHtml(intro)}
            </p>
            ${
              visibleRows.length
                ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:22px 0;border:1px solid #dce6f0;border-radius:14px;overflow:hidden">
                    ${visibleRows
                      .map(
                        ([label, value], index) =>
                          `<tr style="background:${index % 2 === 0 ? "#f7fbff" : "#ffffff"}">
                            <td style="width:38%;padding:12px 14px;color:#5d7488;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid #e7eef6">${escapeHtml(label)}</td>
                            <td style="padding:12px 14px;color:#0b1f33;font-size:14px;font-weight:700;border-bottom:1px solid #e7eef6">${escapeHtml(value)}</td>
                          </tr>`
                      )
                      .join("")}
                  </table>`
                : ""
            }
            <div style="border-left:4px solid #1e9be0;background:#eef8ff;padding:14px 16px;border-radius:12px;color:#334e68;font-size:14px;line-height:1.6">
              Our team will review this and get back to you soon.
            </div>
            <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#0b1f33">
              Regards,<br />
              <strong>MRK Tradex Pvt Ltd</strong>
            </p>
          </div>
        </div>
      </div>
    </div>`;

  return { text, html };
};

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

    // Notify the office. Deliberately not awaited into the response path: a
    // mail outage must not fail an application that is already stored.
    void this.notifyDealerApplication(req.body);
    void this.notifyDealerApplicant(req.body);

    sendResponse(res, 201, {
      data: { dealerApplication },
      message: "Dealer application submitted successfully",
    });
  });

  // Every lead notification lands in the same inbox and reads the same way, so
  // the recipient guard and the table markup live here rather than once per
  // form. Callers only build the label/value pairs; blanks are dropped, so an
  // optional field the visitor skipped never shows up as an empty row.
  private async notifyOffice({
    heading,
    subject,
    rows: allRows,
  }: {
    heading: string;
    subject: string;
    rows: [string, unknown][];
  }) {
    const to = process.env.MRK_NOTIFY_EMAIL || process.env.EMAIL_USER;
    if (!to) {
      console.warn(
        `[mrk] No MRK_NOTIFY_EMAIL or EMAIL_USER set — "${heading}" email skipped`
      );
      return;
    }

    const rows = cleanRows(allRows);

    const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
    const html = `
      <h2 style="font-family:sans-serif;color:#0b1f33">${escapeHtml(heading)}</h2>
      <table style="font-family:sans-serif;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr>
                 <td style="padding:6px 14px 6px 0;color:#5d7488">${escapeHtml(label)}</td>
                 <td style="padding:6px 0;color:#0b1f33"><strong>${escapeHtml(value)}</strong></td>
               </tr>`
          )
          .join("")}
      </table>`;

    await sendEmail({ to, subject, text, html });
  }

  private async notifyDealerApplication(application: Record<string, any>) {
    await this.notifyOffice({
      heading: "New dealer application",
      subject: `New dealer application — ${application.businessName || application.name || "MRK"}`,
      rows: [
        ["Name", application.name],
        ["Business name", application.businessName],
        ["Address", application.address],
        ["Mobile", application.mobile],
        ["WhatsApp", application.whatsapp],
        ["Email", application.email],
        ["City", application.city],
        ["State", application.state],
        ["Pincode", application.pincode],
        ["GST number", application.gstNumber],
        ["Current business", application.currentBusiness],
        ["Experience", application.experience],
        ["Message", application.message],
        ["Source", application.metadata?.source],
      ],
    });
  }

  private async notifyDealerApplicant(application: Record<string, any>) {
    const to = String(application.email || "").trim();
    if (!isValidEmail(to)) {
      return;
    }

    const name = application.name || application.businessName || "there";
    const { text, html } = renderConfirmationEmail({
      eyebrow: "Dealer application",
      title: "Application received successfully",
      intro: `Dear ${name}, thank you for applying to partner with MRK Tradex. We have received your dealership application successfully.`,
      rows: [
        ["Name", application.name],
        ["Business name", application.businessName],
        ["Mobile", application.mobile],
        ["WhatsApp", application.whatsapp],
        ["Email", application.email],
        ["City", application.city],
        ["State", application.state],
        ["Pincode", application.pincode],
      ],
    });

    await sendEmail({
      to,
      subject: "MRK Tradex - Dealer application received",
      text,
      html,
    });
  }

  private async notifyContactSubmission(submission: Record<string, any>) {
    // FEEDBACK and CONTACT share the form and the inbox; the subject line is
    // what tells the two apart at a glance.
    const label =
      submission.type === "FEEDBACK" ? "feedback" : "contact request";

    await this.notifyOffice({
      heading: `New ${label}`,
      subject: `New ${label} — ${submission.subject || submission.name || "MRK"}`,
      rows: [
        ["Name", submission.name],
        ["Email", submission.email],
        ["Phone", submission.phone || submission.mobile],
        ["Subject", submission.subject],
        ["City", submission.city],
        ["State", submission.state],
        ["Type", submission.type],
        ["Message", submission.message],
        ["Source", submission.metadata?.source],
      ],
    });
  }

  private async notifyContactSubmitter(submission: Record<string, any>) {
    const to = String(submission.email || "").trim();
    if (!isValidEmail(to)) {
      return;
    }

    const label =
      submission.type === "FEEDBACK" ? "feedback" : "contact request";
    const name = submission.name || "there";
    const { text, html } = renderConfirmationEmail({
      eyebrow: label,
      title: "Request received successfully",
      intro: `Dear ${name}, thank you for contacting MRK Tradex. We have received your ${label} successfully.`,
      rows: [
        ["Name", submission.name],
        ["Email", submission.email],
        ["Phone", submission.phone || submission.mobile],
        ["Subject", submission.subject],
        ["City", submission.city],
        ["State", submission.state],
        ["Message", submission.message],
      ],
    });

    await sendEmail({
      to,
      subject: "MRK Tradex - We received your request",
      text,
      html,
    });
  }

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

    // Same rule as the dealer form: the row is already stored, so a mail
    // outage must not turn a saved submission into a failed request.
    void this.notifyContactSubmission(req.body);
    void this.notifyContactSubmitter(req.body);

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
