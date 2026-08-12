import nodemailer from "nodemailer";

// Define the type for email options
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Define the type for transporter configuration
interface TransporterConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

// Define the type for mail options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<boolean> => {
  try {
    const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const emailPass =
      process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "";
    const normalizedPassword = emailPass.replace(/\s+/g, "");

    if (!emailUser || !normalizedPassword) {
      console.warn(
        "[email] EMAIL_USER and EMAIL_PASS are required before SMTP mail can be sent."
      );
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: normalizedPassword,
      },
    } as TransporterConfig);

    const mailOptions: MailOptions = {
      // Gmail rewrites From to the authenticated account anyway, so this only
      // controls the display name.
      from: process.env.EMAIL_FROM || `MRK Tradex <${emailUser}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendEmail;
