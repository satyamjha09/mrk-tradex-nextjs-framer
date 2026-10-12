import Link from "next/link";
import type { Metadata } from "next";

type TermsSection = {
  number: string;
  id: string;
  title: string;
  paragraphs: string[];
  privacyLink?: boolean;
};

const sections: TermsSection[] = [
  {
    number: "01",
    id: "website-info",
    title: "Website Information",
    paragraphs: [
      "The information provided on this website is for general product and business information purposes.",
      "We try to keep product descriptions, specifications, pricing, availability and other information accurate and updated. However, details may change from time to time without prior notice.",
      "Final product specifications, price, availability, warranty and commercial terms should be confirmed with MRK Tradex or an authorised dealer before purchase.",
    ],
  },
  {
    number: "02",
    id: "products-availability",
    title: "Products and Availability",
    paragraphs: [
      "Product images shown on the website are for representation purposes. Actual products may vary slightly in appearance, packaging, colour, components or specifications depending on the model or production update.",
      "Availability may vary by location and dealer.",
    ],
  },
  {
    number: "03",
    id: "pricing",
    title: "Pricing",
    paragraphs: [
      "Any prices displayed on the website, catalogue, advertisement or promotional material may be revised without prior notice.",
      "Final pricing, taxes, transportation charges, installation charges or other applicable costs should be confirmed at the time of purchase.",
    ],
  },
  {
    number: "04",
    id: "enquiries-dealership",
    title: "Enquiries and Dealership Applications",
    paragraphs: [
      "Submitting an enquiry, dealership form or partnership request does not create a binding agreement between you and MRK Tradex.",
      "All dealership or partnership applications are subject to review, approval, commercial discussion and applicable terms decided by MRK Tradex.",
    ],
  },
  {
    number: "05",
    id: "warranty-service",
    title: "Warranty and Service",
    paragraphs: [
      "Warranty, service and replacement terms may differ depending on the product.",
      "Customers should refer to the product invoice, warranty card, authorised dealer or MRK Tradex representative for the applicable warranty terms.",
      "Damage caused by improper installation, misuse, unauthorised modification, overloading or use outside recommended specifications may not be covered.",
    ],
  },
  {
    number: "06",
    id: "intellectual-property",
    title: "Intellectual Property",
    paragraphs: [
      "All website content, including the MRK name, logo, product images, text, graphics, designs and other materials, is owned by or licensed to MRK Tradex Pvt Ltd unless otherwise stated.",
      "Such content may not be copied, reproduced, modified or used for commercial purposes without prior written permission.",
    ],
  },
  {
    number: "07",
    id: "third-party-links",
    title: "Third-Party Links",
    paragraphs: [
      "Our website may contain links to third-party websites or services such as WhatsApp, Google Maps, YouTube, Facebook or Instagram.",
      "MRK Tradex is not responsible for the content, availability, security or privacy practices of third-party services.",
    ],
  },
  {
    number: "08",
    id: "limitation-liability",
    title: "Limitation of Liability",
    paragraphs: [
      "MRK Tradex will not be responsible for any indirect, incidental or consequential loss arising solely from reliance on information displayed on this website.",
      "Users should always follow product instructions and obtain appropriate professional or technical assistance where required for installation or electrical work.",
    ],
  },
  {
    number: "09",
    id: "privacy",
    title: "Privacy",
    paragraphs: [
      "Use of personal information submitted through this website is governed by our Privacy Policy.",
    ],
    privacyLink: true,
  },
  {
    number: "10",
    id: "changes",
    title: "Changes to These Terms",
    paragraphs: [
      "MRK Tradex may update these Terms & Conditions from time to time.",
      "The latest version will be published on this page along with the updated date.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Terms & Conditions | MRK Tradex Pvt Ltd",
  description:
    "Terms and Conditions for using the MRK Tradex Pvt Ltd website, product information, enquiries and dealership applications.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <main id="top" className="min-h-screen bg-[#f5f8fc] text-[#334155]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f1b33_0%,#1f3a6e_60%,#2a5aa8_100%)] px-5 pb-28 pt-16 text-white sm:pt-20">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#1e9be9]/30 blur-sm"
        />
        <div className="relative z-10 mx-auto max-w-[1180px]">
          <p className="mb-5 text-sm text-[#b9c7e0]">
            <Link href="/" className="font-semibold text-white">
              Home
            </Link>{" "}
            / Terms & Conditions
          </p>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#1e9be9]">
            MRK Tradex
          </span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.125rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
            Terms & Conditions
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-[#dbe6f7]">
              Last updated: 12 October 2026
            </span>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 grid max-w-[1180px] gap-8 px-5 pb-20 lg:grid-cols-[270px_1fr]">
        <aside className="rounded-[18px] border border-[#e5eaf1] bg-white p-6 shadow-[0_10px_30px_rgba(15,27,51,0.06)] lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">
            On this page
          </h2>
          <ol className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group flex gap-3 rounded-[10px] border-l-[3px] border-transparent px-3 py-2 text-sm font-medium text-[#334155] transition hover:border-[#1e9be9] hover:bg-[#e8f4fd] hover:text-[#0f1b33]"
                >
                  <span className="font-semibold text-[#64748b] group-hover:text-[#1e9be9]">
                    {section.number}
                  </span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <section className="rounded-[18px] border border-[#e5eaf1] bg-white p-6 shadow-[0_10px_30px_rgba(15,27,51,0.06)] sm:p-10 lg:p-14">
          <p className="max-w-[70ch] text-lg leading-8 text-[#334155]">
            Welcome to <strong>MRK Tradex Pvt Ltd</strong>. By accessing or
            using this website, submitting an enquiry, applying for dealership,
            or contacting us through this website, you agree to the following
            Terms & Conditions.
          </p>

          <div className="mt-2">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-b border-[#e5eaf1] py-10 last:border-b-0"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-xl bg-[linear-gradient(135deg,#1f3a6e,#1e9be9)] text-sm font-bold text-white">
                    {section.number}
                  </span>
                  <h2 className="text-xl font-bold text-[#0f1b33] sm:text-[22px]">
                    <a href={`#${section.id}`}>{section.title}</a>
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.privacyLink ? (
                    <p className="max-w-[70ch] text-base leading-8 text-[#334155]">
                      Use of personal information submitted through this
                      website is governed by our{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-semibold text-[#1f3a6e] underline decoration-[#1e9be9] underline-offset-4"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  ) : (
                    section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-[70ch] text-base leading-8 text-[#334155]"
                      >
                        {paragraph}
                      </p>
                    ))
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-[18px] bg-[linear-gradient(135deg,#0f1b33,#1f3a6e)] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[22px] font-bold">11. Contact Us</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#c5d3ea]">
                For any questions regarding these Terms & Conditions, please
                contact MRK Tradex Pvt Ltd, R/3A, Dooars Trp Compound, GT Road,
                Sahibabad, Ghaziabad, Uttar Pradesh - 201005, India.
              </p>
              <p className="mt-3 text-sm text-[#c5d3ea]">
                Phone:{" "}
                <a href="tel:+919319719670" className="font-semibold text-white">
                  +91 93197 19670
                </a>{" "}
                | Email:{" "}
                <a
                  href="mailto:mrktradex@gmail.com"
                  className="font-semibold text-white"
                >
                  mrktradex@gmail.com
                </a>
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 justify-center rounded-full bg-[#1e9be9] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(30,155,233,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1686ca]"
            >
              Contact MRK
            </Link>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#1e9be9] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1f3a6e]"
          >
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}
