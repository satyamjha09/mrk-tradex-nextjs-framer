// @ts-nocheck
"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import useToast from "@/app/hooks/ui/useToast";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { useCreateContactSubmissionMutation } from "@/app/store/apis/MrkApi";
import {
  ArrowRight,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  subject: "",
  message: "",
};

const enquiryTopics = [
  "Product enquiry",
  "Dealer support",
  "Service support",
  "Price list",
  "Warranty",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border-[1.5px] border-slate-300 bg-white px-3.5 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:shadow-[0_0_0_4px_rgba(29,78,216,0.12)]";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function SectionLegend({ number, children }: { number: string; children: string }) {
  return (
    <legend className="mb-5 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs text-white">
        {number}
      </span>
      {children}
    </legend>
  );
}

function RequiredMark() {
  return <span className="text-red-600">*</span>;
}

function OptionalMark() {
  return <span className="text-xs font-normal text-slate-500">(optional)</span>;
}

const ContactPage = () => {
  const { showToast } = useToast();
  const { company, urls } = useMrkSiteSettings();
  const [createContactSubmission, { isLoading }] =
    useCreateContactSubmissionMutation();
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setPhone = (value: string) => {
    setField("phone", value.replace(/\D/g, "").slice(0, 10));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      showToast("Name, phone, and requirement details are required", "error");
      return;
    }

    if (!consent) {
      showToast("Please agree to be contacted by MRK", "error");
      return;
    }

    try {
      await createContactSubmission({
        name: form.name,
        phone: form.phone,
        mobile: form.phone,
        email: form.email || undefined,
        city: form.city || undefined,
        subject: form.subject || "Website enquiry",
        message: form.message,
        metadata: { source: "contact_page" },
      }).unwrap();

      setForm(emptyForm);
      setConsent(false);
      showToast("Contact request submitted successfully", "success");
    } catch (error: any) {
      showToast(
        error.data?.message || "Failed to submit contact request",
        "error",
      );
    }
  };

  const channels = [
    {
      icon: Phone,
      label: "Call us",
      value: company.phone,
      href: urls.phone,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Send an enquiry",
      href: urls.whatsapp,
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: company.email,
      href: urls.email,
    },
    {
      icon: MapPin,
      label: "Visit us",
      value: company.address,
    },
  ];

  return (
    <MainLayout>
      <section
        id="contact"
        className="bg-slate-50 px-5 py-12 text-slate-900 sm:px-6 lg:py-18"
      >
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
          <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Contact MRK
            </span>

            <h1 className="mt-5 max-w-[520px] text-[clamp(2rem,4vw,2.875rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
              Tell us what <span className="text-blue-700">you need</span>
            </h1>
            <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-slate-700">
              Share your pump starter, panel, cable, or smart plug requirement.
              The MRK team will respond with the right product guidance.
            </p>

            <ul className="my-8 grid gap-5">
              {[
                {
                  icon: Headphones,
                  title: "Quick sales response",
                  text: "Get help choosing the right MRK product for your requirement.",
                },
                {
                  icon: Wrench,
                  title: "Technical support",
                  text: "Share HP, phase, load, or installation details for guidance.",
                },
                {
                  icon: ShieldCheck,
                  title: "Service follow-up",
                  text: "Contact us for warranty, replacement, and dealer support.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border border-slate-200 bg-white text-blue-700">
                    <Icon size={20} />
                  </span>
                  <span>
                    <strong className="block text-[15px] font-bold text-slate-900">
                      {title}
                    </strong>
                    <small className="text-sm text-slate-500">{text}</small>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const body = (
                  <>
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border border-slate-200 bg-white text-blue-700">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        {channel.label}
                      </span>
                      <span className="mt-1 block break-words text-sm font-semibold text-slate-900">
                        {channel.value}
                      </span>
                    </span>
                  </>
                );

                const className =
                  "flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-blue-200 hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.28)]";

                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={className}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={channel.label} className={className}>
                    {body}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-7">
                <h2 className="text-[22px] font-extrabold tracking-[-0.01em] text-slate-900">
                  Send an enquiry
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Takes about 1 minute. Fields marked <RequiredMark /> are
                  required.
                </p>
              </div>

              <fieldset className="border-0 pb-6">
                <SectionLegend number="1">About you</SectionLegend>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Name <RequiredMark />
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="Full name"
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email <OptionalMark />
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone number <RequiredMark />
                    </label>
                    <div className="flex overflow-hidden rounded-xl border-[1.5px] border-slate-300 bg-white transition focus-within:border-blue-700 focus-within:shadow-[0_0_0_4px_rgba(29,78,216,0.12)]">
                      <span className="border-r border-slate-200 bg-slate-50 px-3.5 py-3 text-[15px] font-semibold text-slate-700">
                        +91
                      </span>
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        required
                        value={form.phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        autoComplete="tel-national"
                        className="w-full border-0 px-3.5 py-3 text-[15px] outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-city" className={labelClass}>
                      City <OptionalMark />
                    </label>
                    <input
                      id="contact-city"
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City / town"
                      autoComplete="address-level2"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-0 border-t border-slate-200 py-6">
                <SectionLegend number="2">Requirement</SectionLegend>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-subject" className={labelClass}>
                      Subject <OptionalMark />
                    </label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setField("subject", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select one</option>
                      {enquiryTopics.map((topic) => (
                        <option key={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className={labelClass}>
                      Requirement details <RequiredMark />
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      placeholder="Pump HP, phase, model, quantity, or what you need"
                      rows={5}
                      className={`${fieldClass} min-h-32 resize-y`}
                    />
                  </div>
                </div>
              </fieldset>

              <label className="mb-6 flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-[17px] w-[17px] flex-none accent-blue-700"
                />
                I agree to be contacted by MRK on call, WhatsApp, or email
                about this enquiry.
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {isLoading ? "Submitting..." : "Submit enquiry"}
                {!isLoading && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>
              <p className="mt-3.5 text-center text-[13px] text-slate-500">
                Our team usually responds within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
