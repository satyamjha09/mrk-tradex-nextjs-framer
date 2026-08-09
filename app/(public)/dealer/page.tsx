// @ts-nocheck
"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import useToast from "@/app/hooks/ui/useToast";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { useCreateDealerApplicationMutation } from "@/app/store/apis/MrkApi";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

const DealerPage = () => {
  const { showToast } = useToast();
  const { company, urls } = useMrkSiteSettings();
  const [createDealerApplication, { isLoading }] =
    useCreateDealerApplicationMutation();
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    currentBusiness: "",
    productCategories: "",
    experience: "",
    message: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.businessName.trim() ||
      !form.mobile.trim() ||
      !form.address.trim()
    ) {
      showToast(
        "Name, business name, mobile, and address are required",
        "error",
      );
      return;
    }

    try {
      await createDealerApplication({
        name: form.name,
        businessName: form.businessName,
        mobile: form.mobile,
        whatsapp: form.whatsapp || undefined,
        email: form.email || undefined,
        address: form.address,
        city: form.city || undefined,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        gstNumber: form.gstNumber || undefined,
        currentBusiness: form.currentBusiness || undefined,
        productCategories: form.productCategories
          ? form.productCategories
              .split(",")
              .map((category) => category.trim())
              .filter(Boolean)
          : undefined,
        experience: form.experience || undefined,
        message: form.message || undefined,
        metadata: { source: "dealer_page" },
      }).unwrap();

      setForm({
        name: "",
        businessName: "",
        mobile: "",
        whatsapp: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNumber: "",
        currentBusiness: "",
        productCategories: "",
        experience: "",
        message: "",
      });
      showToast("Dealer application submitted successfully", "success");
    } catch (error: any) {
      showToast(
        error.data?.message || "Failed to submit dealer application",
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
                Dealer Application
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-950">
                Become an MRK dealer
              </h1>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Apply to sell {company.shortName} pump starters, control panels,
                smart plugs, cables, and accessories.
              </p>
            </div>

            <a
              href={urls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-black px-4 py-3 text-sm font-semibold text-black hover:bg-gray-100"
            >
              <MessageCircle size={18} />
              Discuss on WhatsApp
            </a>
          </section>

          <form
            onSubmit={handleSubmit}
            className="min-w-0 space-y-4 rounded-sm border border-gray-200 bg-white p-5 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["name", "Contact person"],
                ["businessName", "Business name"],
                ["mobile", "Mobile number"],
                ["whatsapp", "WhatsApp number optional"],
                ["email", "Email optional"],
                ["city", "City optional"],
                ["state", "State optional"],
                ["pincode", "Pincode optional"],
                ["gstNumber", "GST optional"],
                ["currentBusiness", "Current business optional"],
                ["experience", "Experience optional"],
              ].map(([key, placeholder]) => (
                <input
                  key={key}
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  className="w-full min-w-0 rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
                />
              ))}
            </div>
            <textarea
              value={form.productCategories}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  productCategories: e.target.value,
                }))
              }
              placeholder="Product categories handled, comma separated"
              rows={2}
              className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
            />
            <textarea
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Business address"
              rows={3}
              className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
            />
            <textarea
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Message optional"
              rows={4}
              className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
            />
            <button
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              <Send size={18} />
              {isLoading ? "Submitting..." : "Submit Dealer Application"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default DealerPage;
