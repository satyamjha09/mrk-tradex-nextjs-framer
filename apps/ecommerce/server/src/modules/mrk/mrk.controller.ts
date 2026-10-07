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

const publicAssetUrl = (path: string) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    "https://www.mrktradex.com";
  return `${siteUrl.replace(/\/$/, "")}${path}`;
};

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

  const logoUrl = publicAssetUrl("/images/mrk-logo.png");
  const heroUrl = publicAssetUrl("/images/mrk-hero-products-2026.png");

  const html = `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827">
      <div style="max-width:760px;margin:0 auto;padding:34px 18px">
        <div style="background:#ffffff;border:1px solid #e7edf5;border-radius:12px;overflow:hidden">
          <div style="padding:34px 32px 22px">
            <img src="${logoUrl}" width="124" alt="MRK Tradex" style="display:block;height:auto;border:0;outline:none;text-decoration:none" />
          </div>

          <div style="padding:0 32px">
            <div style="border-radius:20px;overflow:hidden;background:#eef6fc;border:1px solid #e6eef7">
              <img src="${heroUrl}" width="696" alt="MRK starter panels and pump protection products" style="display:block;width:100%;max-width:696px;height:auto;border:0;outline:none;text-decoration:none" />
            </div>
          </div>

          <div style="padding:32px 32px 36px">
            <div style="display:inline-block;margin:0 0 18px;border-radius:999px;background:#1e9be0;color:#ffffff;padding:8px 15px;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase">
              ${escapeHtml(eyebrow)}
            </div>
            <h1 style="margin:0 0 18px;font-size:29px;line-height:1.2;font-weight:800;color:#0b1f33">
              ${escapeHtml(title)}
            </h1>
            <p style="margin:0 0 18px;font-size:17px;line-height:1.7;color:#4b5563">
              ${escapeHtml(intro)}
            </p>
            <p style="margin:0 0 26px;font-size:17px;line-height:1.7;color:#4b5563">
              Your details are now with our team. We will review them and get back to you soon with the right support.
            </p>
            ${
              visibleRows.length
                ? `<h2 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:800;color:#111827">Submission summary</h2>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 12px;margin:0 0 28px">
                    ${visibleRows
                      .map(
                        ([label, value]) =>
                          `<tr>
                            <td style="width:34%;padding:14px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-right:0;border-radius:14px 0 0 14px;color:#6b7280;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em">${escapeHtml(label)}</td>
                            <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-left:0;border-radius:0 14px 14px 0;color:#111827;font-size:15px;font-weight:700">${escapeHtml(value)}</td>
                          </tr>`
                      )
                      .join("")}
                  </table>`
                : ""
            }
            <div style="background:#eef8ff;border:1px solid #d7efff;border-radius:18px;padding:18px 20px;color:#334155;font-size:15px;line-height:1.7">
              <strong style="color:#0b1f33">What happens next?</strong><br />
              MRK Tradex will review your request and contact you using the phone or email you submitted.
            </div>
            <p style="margin:30px 0 0;font-size:16px;line-height:1.7;color:#4b5563">
              Regards,<br/>
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
      intro: `Hey ${name}, thank you for applying to partner with MRK Tradex. We have received your dealership application successfully.`,
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
      intro: `Hey ${name}, thank you for contacting MRK Tradex. We have received your ${label} successfully.`,
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
