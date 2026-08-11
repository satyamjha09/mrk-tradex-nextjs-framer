// @ts-nocheck
"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import useToast from "@/app/hooks/ui/useToast";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { useCreateContactSubmissionMutation } from "@/app/store/apis/MrkApi";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";

/**
 * Field config mirrors the dealer application form on the home page, so both
 * forms label, place and autocomplete their inputs the same way. `half` puts
 * the field in the two-up row; everything else spans the full width.
 */
const contactFields = [
  {
    name: "name",
    label: "Name",
    hi: "नाम",
    placeholder: "Your full name",
    autoComplete: "name",
    required: true,
    half: true,
  },
  {
    name: "phone",
    label: "Phone number",
    hi: "मोबाइल नंबर",
    placeholder: "10-digit mobile number",
    autoComplete: "tel",
    type: "tel",
    inputMode: "numeric",
    required: true,
    half: true,
  },
  {
    name: "email",
    label: "Email",
    hi: "ईमेल",
    placeholder: "you@example.com",
    autoComplete: "email",
    type: "email",
    half: true,
  },
  {
    name: "city",
    label: "City",
    hi: "शहर",
    placeholder: "Your city",
    autoComplete: "address-level2",
    half: true,
  },
  {
    name: "subject",
    label: "Subject",
    hi: "विषय",
    placeholder: "What is this about?",
  },
  {
    name: "message",
    label: "Requirement details",
    hi: "आपकी ज़रूरत",
    placeholder: "Pump HP, phase, and what you need",
    multiline: true,
    required: true,
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  subject: "",
  message: "",
};

const ContactPage = () => {
  const { showToast } = useToast();
  const { company, urls } = useMrkSiteSettings();
  const [createContactSubmission, { isLoading }] =
    useCreateContactSubmissionMutation();
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      showToast("Name, phone, and message are required", "error");
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
      hi: "कॉल करें",
      value: company.phone,
      href: urls.phone,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      hi: "व्हाट्सएप",
      value: "Send an enquiry",
      href: urls.whatsapp,
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      hi: "ईमेल",
      value: company.email,
      href: urls.email,
    },
    {
      icon: MapPin,
      label: "Visit us",
      hi: "पता",
      value: company.address,
    },
  ];

  const fieldClass =
    "w-full min-w-0 rounded-xl border border-[#e4ecf4] bg-white px-4 py-3.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-[#9aa8b8] focus:border-aqua";

  const labelClass =
    "mb-2 block font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink";

  return (
    <MainLayout>
      {/* Same gradient-and-blur treatment as the "Why India chooses MRK"
          section, so the page reads as part of the site rather than a form
          bolted onto the end of it. */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F8FC_100%)] py-[clamp(4.5rem,9vw,8rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-44 top-16 h-[520px] w-[520px] rounded-full bg-[#dceefe]/70 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 bottom-0 h-[560px] w-[560px] rounded-full bg-[#cfe7fb]/60 blur-[150px]"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="min-w-0">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 inline-block font-mono text-[0.9rem] font-bold uppercase leading-none tracking-[0.3em] text-[#1598df]"
                data-hi="संपर्क करें"
              >
                Contact MRK
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans text-[clamp(2.25rem,4.6vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink"
                data-hi="बताइए आपको क्या चाहिए"
              >
                Tell us what you need
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-[52ch] text-[1.02rem] leading-[1.8] text-muted"
                data-hi="अपने पंप स्टार्टर, पैनल, केबल या स्मार्ट प्लग की ज़रूरत बताइए, MRK टीम जवाब देगी।"
              >
                Share your pump starter, panel, cable, or smart plug requirement
                and the MRK team will respond.
              </motion.p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {channels.map((channel, index) => {
                  const Icon = channel.icon;

                  const body = (
                    <>
                      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-mist text-aqua transition-colors group-hover:bg-aqua group-hover:text-white">
                        <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span
                          className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
                          data-hi={channel.hi}
                        >
                          {channel.label}
                        </span>
                        <span className="mt-1 block break-words text-[0.95rem] font-semibold leading-[1.5] text-ink">
                          {channel.value}
                        </span>
                      </span>
                    </>
                  );

                  const cardClass =
                    "group flex items-start gap-4 rounded-xl bg-mist p-5 text-left no-underline transition duration-300 ease-in-out";

                  return (
                    <motion.div
                      key={channel.label}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.24 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {channel.href ? (
                        <a
                          href={channel.href}
                          {...(channel.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className={`${cardClass} hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_rgba(11,31,51,.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua`}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className={cardClass}>{body}</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 rounded-[24px] border border-line bg-white p-6 shadow-[0_24px_60px_rgba(11,31,51,0.08)] sm:p-8"
            >
              <h2
                className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink"
                data-hi="पूछताछ भेजें"
              >
                Send an enquiry
              </h2>
              <p
                className="mt-2 text-[0.9rem] leading-relaxed text-muted"
                data-hi="तारांकित फ़ील्ड ज़रूरी हैं।"
              >
                Fields marked with an asterisk are required.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {contactFields.map((field) => (
                  <div
                    key={field.name}
                    className={field.half ? "min-w-0" : "min-w-0 sm:col-span-2"}
                  >
                    <label
                      htmlFor={`contact-${field.name}`}
                      className={labelClass}
                      data-hi={field.hi}
                    >
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-aqua" aria-hidden="true">
                          *
                        </span>
                      )}
                    </label>

                    {field.multiline ? (
                      <textarea
                        id={`contact-${field.name}`}
                        name={field.name}
                        rows={5}
                        required={field.required}
                        value={form[field.name]}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.name]: event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        className={`${fieldClass} resize-none`}
                      />
                    ) : (
                      <input
                        id={`contact-${field.name}`}
                        name={field.name}
                        type={field.type ?? "text"}
                        inputMode={field.inputMode}
                        required={field.required}
                        value={form[field.name]}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.name]: event.target.value,
                          }))
                        }
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        className={fieldClass}
                      />
                    )}
                  </div>
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#0b1f33] px-8 py-4 text-[0.95rem] font-bold text-white shadow-[0_10px_28px_rgba(11,31,51,0.18)] transition-colors hover:bg-[#12315e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua disabled:cursor-not-allowed disabled:opacity-60"
                data-hi="पूछताछ भेजें"
              >
                <Send size={18} aria-hidden="true" />
                {isLoading ? "Submitting..." : "Submit enquiry"}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
