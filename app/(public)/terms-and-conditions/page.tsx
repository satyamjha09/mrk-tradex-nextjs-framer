import Link from "next/link";
import type { Metadata } from "next";

const sections = [
  {
    title: "1. Website Information",
    body: "The information provided on this website is for general product and business information purposes. We try to keep product descriptions, specifications, pricing, availability and other information accurate and updated. However, details may change from time to time without prior notice. Final product specifications, price, availability, warranty and commercial terms should be confirmed with MRK Tradex or an authorised dealer before purchase.",
  },
  {
    title: "2. Products and Availability",
    body: "Product images shown on the website are for representation purposes. Actual products may vary slightly in appearance, packaging, colour, components or specifications depending on the model or production update. Availability may vary by location and dealer.",
  },
  {
    title: "3. Pricing",
    body: "Any prices displayed on the website, catalogue, advertisement or promotional material may be revised without prior notice. Final pricing, taxes, transportation charges, installation charges or other applicable costs should be confirmed at the time of purchase.",
  },
  {
    title: "4. Enquiries and Dealership Applications",
    body: "Submitting an enquiry, dealership form or partnership request does not create a binding agreement between you and MRK Tradex. All dealership or partnership applications are subject to review, approval, commercial discussion and applicable terms decided by MRK Tradex.",
  },
  {
    title: "5. Warranty and Service",
    body: "Warranty, service and replacement terms may differ depending on the product. Customers should refer to the product invoice, warranty card, authorised dealer or MRK Tradex representative for the applicable warranty terms. Damage caused by improper installation, misuse, unauthorised modification, overloading or use outside recommended specifications may not be covered.",
  },
  {
    title: "6. Intellectual Property",
    body: "All website content, including the MRK name, logo, product images, text, graphics, designs and other materials, is owned by or licensed to MRK Tradex Pvt Ltd unless otherwise stated. Such content may not be copied, reproduced, modified or used for commercial purposes without prior written permission.",
  },
  {
    title: "7. Third-Party Links",
    body: "Our website may contain links to third-party websites or services such as WhatsApp, Google Maps, YouTube, Facebook or Instagram. MRK Tradex is not responsible for the content, availability, security or privacy practices of third-party services.",
  },
  {
    title: "8. Limitation of Liability",
    body: "MRK Tradex will not be responsible for any indirect, incidental or consequential loss arising solely from reliance on information displayed on this website. Users should always follow product instructions and obtain appropriate professional or technical assistance where required for installation or electrical work.",
  },
  {
    title: "9. Privacy",
    body: "Use of personal information submitted through this website is governed by our Privacy Policy.",
  },
  {
    title: "10. Changes to These Terms",
    body: "MRK Tradex may update these Terms & Conditions from time to time. The latest version will be published on this page along with the updated date.",
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
    <main className="bg-paper px-5 py-16 text-ink">
      <section className="mx-auto max-w-4xl rounded-[1.5rem] border border-line bg-white p-6 shadow-[0_24px_60px_rgba(11,31,51,0.08)] sm:p-10">
        <div className="mb-10 border-b border-line pb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-aqua">
            MRK Tradex
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-sm font-semibold text-muted">
            Last updated: 12 October 2026
          </p>
          <p className="mt-6 text-lg leading-8 text-muted">
            Welcome to MRK Tradex Pvt Ltd. By accessing or using this website,
            submitting an enquiry, applying for dealership, or contacting us
            through this website, you agree to the following Terms &
            Conditions.
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
          <h2 className="mb-2 text-xl font-bold">11. Contact Us</h2>
          <p className="text-white/75">
            For any questions regarding these Terms & Conditions, please
            contact MRK Tradex Pvt Ltd, R/3A, Dooars Trp Compound, GT Road,
            Sahibabad, Ghaziabad, Uttar Pradesh - 201005, India.
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
