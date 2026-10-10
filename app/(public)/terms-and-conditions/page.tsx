import Link from "next/link";

const sections = [
  {
    title: "Use of this website",
    body: "This website is provided for MRK Tradex product information, catalogue browsing, enquiries, downloads, contact requests, and dealer applications. You agree to use it only for lawful business or personal enquiry purposes.",
  },
  {
    title: "Product information",
    body: "Product details, prices, specifications, images, availability, and catalogue information are provided for guidance and may change without notice. Final pricing, warranty, suitability, and supply terms should be confirmed with MRK Tradex before purchase or dealership decisions.",
  },
  {
    title: "Enquiries and dealer applications",
    body: "When you submit an enquiry or dealer application, you confirm that the information provided is accurate. Submission does not guarantee approval, dealership appointment, product supply, or any commercial commitment from MRK Tradex.",
  },
  {
    title: "Communication",
    body: "By submitting forms on this website, you agree that MRK Tradex may contact you by phone, WhatsApp, email, or other suitable channels regarding your enquiry, service request, product interest, or dealer application.",
  },
  {
    title: "Intellectual property",
    body: "The MRK name, logo, product images, website content, catalogue material, and related assets belong to MRK Tradex or its licensors. They may not be copied, reused, or represented as your own without written permission.",
  },
  {
    title: "Limitation of liability",
    body: "MRK Tradex aims to keep website information accurate and available, but does not guarantee uninterrupted access or error-free content. To the maximum extent permitted by law, MRK Tradex is not liable for losses arising from use of this website or reliance on website information alone.",
  },
];

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
            Last updated: 1 September 2026
          </p>
          <p className="mt-6 text-lg leading-8 text-muted">
            These terms explain the basic conditions for using the MRK Tradex
            website, product information, enquiry forms, downloads, and dealer
            application flow.
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
          <h2 className="mb-2 text-xl font-bold">Questions</h2>
          <p className="text-white/75">
            For terms, business, or account questions, contact us at{" "}
            <a
              href="mailto:rajesh.mrktradex@gmail.com"
              className="font-semibold text-white underline decoration-aqua underline-offset-4"
            >
              rajesh.mrktradex@gmail.com
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
