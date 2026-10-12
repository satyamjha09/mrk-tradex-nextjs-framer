import Link from "next/link";
import type { Metadata } from "next";

type PrivacySection = {
  number: string;
  id: string;
  title: string;
  paragraphs: string[];
};

const sections: PrivacySection[] = [
  {
    number: "01",
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "When you visit mrktradex.com, submit an enquiry, apply for a dealership, contact us through phone, WhatsApp or email, or interact with our advertisements, we may collect information such as your name, mobile number, email address, business name, address, enquiry details and information submitted through website forms.",
      "We may also collect basic website usage information where applicable.",
    ],
  },
  {
    number: "02",
    id: "how-we-use-information",
    title: "How we use information",
    paragraphs: [
      "We use this information to respond to product and dealership enquiries, contact you regarding products, pricing, support or business opportunities, connect you with MRK representatives or dealers, improve our website, products and customer experience, measure the effectiveness of our marketing and advertisements, and meet applicable legal or regulatory requirements.",
    ],
  },
  {
    number: "03",
    id: "advertising-platforms",
    title: "Advertising and third-party platforms",
    paragraphs: [
      "If you submit your details through platforms such as Facebook, Instagram, Google or other advertising platforms, the information you provide may be shared with MRK Tradex so that we can respond to your inquiry.",
      "Those platforms may also process information according to their own privacy policies.",
    ],
  },
  {
    number: "04",
    id: "cookies",
    title: "Cookies and similar technologies",
    paragraphs: [
      "Our website may use cookies and similar technologies for website functionality, analytics and advertising measurement.",
      "Some of these technologies may be provided by third-party services.",
    ],
  },
  {
    number: "05",
    id: "sharing-information",
    title: "Sharing information",
    paragraphs: [
      "MRK Tradex does not sell your personal information.",
      "We may share information only where reasonably necessary with our employees, authorised representatives, dealers, service providers, advertising or analytics providers, or authorities where required by law.",
    ],
  },
  {
    number: "06",
    id: "retention-security-choices",
    title: "Retention, security and your choices",
    paragraphs: [
      "We retain personal information only for as long as reasonably necessary for business, support or legal purposes and take reasonable measures to protect it from unauthorised access or misuse.",
      "You may contact us to request correction or deletion of your information, withdraw consent, opt out of promotional communication, or raise a privacy-related concern.",
    ],
  },
];

const summaryItems = [
  "MRK Tradex uses your details to respond to enquiries and dealership requests.",
  "We may contact you through phone, WhatsApp, SMS or email regarding your enquiry.",
  "MRK Tradex does not sell your personal information.",
  "You may contact us for correction, deletion, opt-out or privacy concerns.",
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
            / Privacy Policy
          </p>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#1e9be9]">
            MRK Tradex
          </span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.125rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
            Privacy Policy
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-[#dbe6f7]">
              Last updated: 12 October 2026
            </span>
            <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-[#dbe6f7]">
              4 min read
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
            <strong>MRK Tradex Pvt Ltd</strong> respects your privacy and is
            committed to protecting the personal information you share with us.
          </p>

          <div className="mt-8 rounded-[14px] border-l-4 border-[#1e9be9] bg-[#e8f4fd] p-6">
            <h2 className="mb-3 text-base font-bold text-[#1f3a6e]">
              Quick summary
            </h2>
            <ul className="grid gap-2">
              {summaryItems.map((item) => (
                <li
                  key={item}
                  className="relative pl-7 text-[15px] leading-7 text-[#334155] before:absolute before:left-0 before:top-[0.55rem] before:h-2 before:w-2 before:rounded-full before:bg-[#1e9be9] before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

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
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="max-w-[70ch] text-base leading-8 text-[#334155]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-[18px] bg-[linear-gradient(135deg,#0f1b33,#1f3a6e)] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[22px] font-bold">Contact Us</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#c5d3ea]">
                MRK Tradex Pvt Ltd, R/3A, Dooars Trp Compound, GT Road,
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
