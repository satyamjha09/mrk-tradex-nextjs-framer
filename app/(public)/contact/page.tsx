// @ts-nocheck
"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import useToast from "@/app/hooks/ui/useToast";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { useCreateContactSubmissionMutation } from "@/app/store/apis/MrkApi";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const { showToast } = useToast();
  const { company, urls } = useMrkSiteSettings();
  const [createContactSubmission, { isLoading }] =
    useCreateContactSubmissionMutation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    subject: "",
    message: "",
  });

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

      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        subject: "",
        message: "",
      });
      showToast("Contact request submitted successfully", "success");
    } catch (error: any) {
      showToast(
        error.data?.message || "Failed to submit contact request",
        "error",
      );
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1760px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 xl:px-16">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="min-w-0 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-black">
                Contact MRK
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-950">
                Tell us what you need
              </h1>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Share your pump starter, panel, cable, or smart plug requirement
                and the MRK team will respond.
              </p>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <a href={urls.phone} className="flex items-center gap-3">
                <Phone size={18} className="text-black" />
                {company.phone}
              </a>
              <a href={urls.email} className="flex items-center gap-3">
                <Mail size={18} className="text-black" />
                {company.email}
              </a>
              <a
                href={urls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle size={18} className="text-black" />
                WhatsApp enquiry
              </a>
              <p className="flex items-start gap-3">
                <MapPin size={18} className="text-black mt-0.5" />
                <span>{company.address}</span>
              </p>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="min-w-0 space-y-4 rounded-sm border border-gray-200 bg-white p-5 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                className="w-full min-w-0 rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
              />
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Phone number"
                required
                className="w-full min-w-0 rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
              />
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email optional"
                className="w-full min-w-0 rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
              />
              <input
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="City optional"
                className="w-full min-w-0 rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>
            <input
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="Subject optional"
              className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
            />
            <textarea
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Requirement details"
              rows={5}
              className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
            />
            <button
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              <Send size={18} />
              {isLoading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
