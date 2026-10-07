import Link from "next/link";

const sections = [
  {
    title: "Information we process",
    body: "metawhat processes account details, workspace details, contacts, consent records, WhatsApp templates, messages, delivery events, campaign data, automation logs, billing records, support records, security logs, and integration credentials needed to provide the service.",
  },
  {
    title: "How we use information",
    body: "We use this information to operate the WhatsApp Business SaaS platform, send and receive messages through connected providers, manage templates and webhooks, provide support, secure accounts, process billing, detect abuse, maintain audit records, and meet legal obligations.",
  },
  {
    title: "Sharing and subprocessors",
    body: "We share data only where needed to operate the product, including with Meta/WhatsApp, payment providers, hosting providers, email providers, analytics or monitoring systems, and other services configured by the workspace administrator.",
  },
  {
    title: "Your choices",
    body: "You can request access, correction, export, deletion, or anonymization of eligible personal data. Some records may be retained where required for tax, billing, legal, security, fraud-prevention, audit, or compliance reasons.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-paper px-5 py-16 text-ink">
      <section className="mx-auto max-w-4xl rounded-[1.5rem] border border-line bg-white p-6 shadow-[0_24px_60px_rgba(11,31,51,0.08)] sm:p-10">
        <div className="mb-10 border-b border-line pb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-aqua">
            metawhat
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm font-semibold text-muted">
            Last updated: 1 September 2026
          </p>
          <p className="mt-6 text-lg leading-8 text-muted">
            This policy explains how metawhat handles information when
            businesses use our WhatsApp Business workflow platform.
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
          <h2 className="mb-2 text-xl font-bold">Privacy contact</h2>
          <p className="text-white/75">
            For privacy, deletion, or account data questions, contact us at{" "}
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
