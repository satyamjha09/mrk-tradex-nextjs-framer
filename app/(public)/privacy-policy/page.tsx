import Link from "next/link";
import type { Metadata } from "next";

const sections = [
  {
    title: "Information we collect",
    body: "When you visit mrktradex.com, submit an enquiry, apply for a dealership, contact us through phone, WhatsApp or email, or interact with our advertisements, we may collect information such as your name, mobile number, email address, business name, address, enquiry details and information submitted through website forms. We may also collect basic website usage information where applicable.",
  },
  {
    title: "How we use information",
    body: "We use this information to respond to product and dealership enquiries, contact you regarding products, pricing, support or business opportunities, connect you with MRK representatives or dealers, improve our website, products and customer experience, measure the effectiveness of our marketing and advertisements, and meet applicable legal or regulatory requirements.",
  },
  {
    title: "Advertising and third-party platforms",
    body: "If you submit your details through platforms such as Facebook, Instagram, Google or other advertising platforms, the information you provide may be shared with MRK Tradex so that we can respond to your inquiry. Those platforms may also process information according to their own privacy policies.",
  },
  {
    title: "Cookies and similar technologies",
    body: "Our website may use cookies and similar technologies for website functionality, analytics and advertising measurement. Some of these technologies may be provided by third-party services.",
  },
  {
    title: "Sharing information",
    body: "MRK Tradex does not sell your personal information. We may share information only where reasonably necessary with our employees, authorised representatives, dealers, service providers, advertising or analytics providers, or authorities where required by law.",
  },
  {
    title: "Retention, security and your choices",
    body: "We retain personal information only for as long as reasonably necessary for business, support or legal purposes and take reasonable measures to protect it from unauthorised access or misuse. You may contact us to request correction or deletion of your information, withdraw consent, opt out of promotional communication, or raise a privacy-related concern.",
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy | MRK Tradex Pvt Ltd",
  description:
    "Privacy Policy for MRK Tradex Pvt Ltd website enquiries, dealership applications, contact requests and communications.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-paper px-5 py-16 text-ink">
      <section className="mx-auto max-w-4xl rounded-[1.5rem] border border-line bg-white p-6 shadow-[0_24px_60px_rgba(11,31,51,0.08)] sm:p-10">
        <div className="mb-10 border-b border-line pb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-aqua">
            MRK Tradex
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm font-semibold text-muted">
            Last updated: 12 October 2026
          </p>
          <p className="mt-6 text-lg leading-8 text-muted">
            MRK Tradex Pvt Ltd respects your privacy and is committed to
            protecting the personal information you share with us.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-line bg-paper/60 p-5"
            >
              <h2 className="mb-3 text-xl font-bold">{section.title}</h2>
              <p className="leading-8 text-muted">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-ink p-5 text-white">
          <h2 className="mb-2 text-xl font-bold">Contact Us</h2>
          <p className="text-white/75">
            MRK Tradex Pvt Ltd, R/3A, Dooars Trp Compound, GT Road, Sahibabad,
            Ghaziabad, Uttar Pradesh - 201005, India.
            <br />
            Phone:{" "}
            <a
              href="tel:+919319719670"
              className="font-semibold text-white underline decoration-aqua underline-offset-4"
            >
              +91 93197 19670
            </a>{" "}
            | Email:{" "}
            <a
              href="mailto:mrktradex@gmail.com"
              className="font-semibold text-white underline decoration-aqua underline-offset-4"
            >
              mrktradex@gmail.com
            </a>
            .
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-aqua px-5 py-3 text-sm font-bold text-white transition hover:bg-marine"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
