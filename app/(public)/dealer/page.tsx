// @ts-nocheck
"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import useToast from "@/app/hooks/ui/useToast";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { useCreateDealerApplicationMutation } from "@/app/store/apis/MrkApi";
import {
  ArrowRight,
  Check,
  DollarSign,
  Megaphone,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other / UT",
];

const productOptions = [
  "Pump starters",
  "Control panels",
  "Smart plugs",
  "Cables",
  "Accessories",
];

const businessOptions = [
  "Electrical shop",
  "Agri / pump store",
  "Hardware store",
  "Electrical contractor",
  "Distributor / wholesaler",
  "Other",
];

const experienceOptions = [
  "New business",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const emptyForm = {
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
  productCategories: [],
  experience: "",
  message: "",
};

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

const DealerPage = () => {
  const { showToast } = useToast();
  const { urls, company } = useMrkSiteSettings();
  const [createDealerApplication, { isLoading }] =
    useCreateDealerApplicationMutation();
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "mobile" && sameAsMobile ? { whatsapp: value } : {}),
    }));
  };

  const setDigitsField = (key: keyof typeof form, value: string, max: number) => {
    setField(key, value.replace(/\D/g, "").slice(0, max));
  };

  const toggleProduct = (product: string) => {
    setForm((prev) => {
      const selected = prev.productCategories.includes(product);
      return {
        ...prev,
        productCategories: selected
          ? prev.productCategories.filter((item) => item !== product)
          : [...prev.productCategories, product],
      };
    });
  };

  const handleSameAsMobile = (checked: boolean) => {
    setSameAsMobile(checked);
    setForm((prev) => ({ ...prev, whatsapp: checked ? prev.mobile : "" }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.businessName.trim() ||
      !form.mobile.trim() ||
      !form.address.trim()
    ) {
      showToast(
        "Contact person, business name, mobile, and address are required",
        "error",
      );
      return;
    }

    if (!consent) {
      showToast("Please agree to be contacted by MRK", "error");
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
        productCategories: form.productCategories.length
          ? form.productCategories
          : undefined,
        experience: form.experience || undefined,
        message: form.message || undefined,
        metadata: { source: "dealer_page" },
      }).unwrap();

      setForm(emptyForm);
      setSameAsMobile(false);
      setConsent(false);
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
      <section
        id="dealer-application"
        className="bg-slate-50 px-5 py-12 text-slate-900 sm:px-6 lg:py-18"
      >
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
          <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Dealer Application
            </span>

            <h1 className="mt-5 max-w-[520px] text-[clamp(2rem,4vw,2.875rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
              Become a <span className="text-blue-700">MRK</span> dealer
            </h1>
            <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-slate-700">
              Apply to sell {company.shortName} pump starters, control panels,
              smart plugs, cables and accessories in your area.
            </p>

            <ul className="my-8 grid gap-5">
              {[
                {
                  icon: DollarSign,
                  title: "Healthy dealer margins",
                  text: "Competitive pricing across the full product range.",
                },
                {
                  icon: ShieldCheck,
                  title: "Warranty & service support",
                  text: "Hassle-free replacements and technical help.",
                },
                {
                  icon: Megaphone,
                  title: "Marketing material",
                  text: "Display boards, brochures and product training.",
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

            <div className="mb-8 flex flex-wrap gap-2">
              {["Apply", "We call you", "Start selling"].map((step, index) => (
                <span
                  key={step}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700"
                >
                  <b className="mr-1 text-blue-700">{index + 1}</b>
                  {step}
                </span>
              ))}
            </div>

            <a
              href={urls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-green-600 bg-white px-5 py-3 text-[15px] font-bold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
            >
              <MessageCircle size={20} />
              Discuss on WhatsApp
            </a>
            <p className="mt-3 text-sm text-slate-500">
              Prefer a call?{" "}
              <a href={urls.phone} className="font-semibold text-slate-900">
                {company.phone}
              </a>
            </p>
          </aside>

          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-7">
                <h2 className="text-[22px] font-extrabold tracking-[-0.01em] text-slate-900">
                  Submit dealer application
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Takes about 2 minutes. Fields marked <RequiredMark /> are
                  required.
                </p>
              </div>

              <fieldset className="border-0 pb-6">
                <SectionLegend number="1">About you</SectionLegend>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact_person" className={labelClass}>
                      Contact person <RequiredMark />
                    </label>
                    <input
                      id="contact_person"
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
                    <label htmlFor="email" className={labelClass}>
                      Email <OptionalMark />
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className={labelClass}>
                      Mobile number <RequiredMark />
                    </label>
                    <div className="flex overflow-hidden rounded-xl border-[1.5px] border-slate-300 bg-white transition focus-within:border-blue-700 focus-within:shadow-[0_0_0_4px_rgba(29,78,216,0.12)]">
                      <span className="border-r border-slate-200 bg-slate-50 px-3.5 py-3 text-[15px] font-semibold text-slate-700">
                        +91
                      </span>
                      <input
                        id="mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        required
                        value={form.mobile}
                        onChange={(e) =>
                          setDigitsField("mobile", e.target.value, 10)
                        }
                        placeholder="98765 43210"
                        autoComplete="tel-national"
                        className="w-full border-0 px-3.5 py-3 text-[15px] outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className={labelClass}>
                      WhatsApp number <OptionalMark />
                    </label>
                    <div className="flex overflow-hidden rounded-xl border-[1.5px] border-slate-300 bg-white transition focus-within:border-blue-700 focus-within:shadow-[0_0_0_4px_rgba(29,78,216,0.12)]">
                      <span className="border-r border-slate-200 bg-slate-50 px-3.5 py-3 text-[15px] font-semibold text-slate-700">
                        +91
                      </span>
                      <input
                        id="whatsapp"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        readOnly={sameAsMobile}
                        value={form.whatsapp}
                        onChange={(e) =>
                          setDigitsField("whatsapp", e.target.value, 10)
                        }
                        placeholder="98765 43210"
                        className="w-full border-0 px-3.5 py-3 text-[15px] outline-none placeholder:text-slate-400 read-only:bg-slate-50"
                      />
                    </div>
                    <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-[13px] text-slate-500">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => handleSameAsMobile(e.target.checked)}
                        className="h-[15px] w-[15px] accent-blue-700"
                      />
                      Same as mobile
                    </label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-0 border-t border-slate-200 py-6">
                <SectionLegend number="2">Your business</SectionLegend>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="business_name" className={labelClass}>
                      Business name <RequiredMark />
                    </label>
                    <input
                      id="business_name"
                      type="text"
                      required
                      value={form.businessName}
                      onChange={(e) =>
                        setField("businessName", e.target.value)
                      }
                      placeholder="e.g. Sharma Electricals"
                      autoComplete="organization"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="gst" className={labelClass}>
                      GST number <OptionalMark />
                    </label>
                    <input
                      id="gst"
                      type="text"
                      maxLength={15}
                      value={form.gstNumber}
                      onChange={(e) =>
                        setField("gstNumber", e.target.value.toUpperCase())
                      }
                      placeholder="22AAAAA0000A1Z5"
                      className={`${fieldClass} uppercase`}
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      Needed for billing. You can add it later.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="current_business" className={labelClass}>
                      What do you currently sell? <OptionalMark />
                    </label>
                    <select
                      id="current_business"
                      value={form.currentBusiness}
                      onChange={(e) =>
                        setField("currentBusiness", e.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="">Select one</option>
                      {businessOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className={labelClass}>
                      Years in the trade <OptionalMark />
                    </label>
                    <select
                      id="experience"
                      value={form.experience}
                      onChange={(e) => setField("experience", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select one</option>
                      {experienceOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Products you&apos;re interested in
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {productOptions.map((product) => {
                        const checked =
                          form.productCategories.includes(product);
                        return (
                          <button
                            key={product}
                            type="button"
                            onClick={() => toggleProduct(product)}
                            className={`inline-flex items-center gap-2 rounded-full border-[1.5px] px-4 py-2.5 text-sm font-semibold transition ${
                              checked
                                ? "border-blue-700 bg-blue-50 text-blue-900"
                                : "border-slate-300 bg-white text-slate-700 hover:border-blue-700"
                            }`}
                          >
                            <span
                              className={`grid h-4 w-4 place-items-center rounded border-[1.5px] ${
                                checked
                                  ? "border-blue-700 bg-blue-700 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {checked && <Check size={11} strokeWidth={3} />}
                            </span>
                            {product}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-0 border-t border-slate-200 py-6">
                <SectionLegend number="3">Location</SectionLegend>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pincode" className={labelClass}>
                      Pincode <OptionalMark />
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[1-9][0-9]{5}"
                      value={form.pincode}
                      onChange={(e) =>
                        setDigitsField("pincode", e.target.value, 6)
                      }
                      placeholder="110001"
                      autoComplete="postal-code"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className={labelClass}>
                      City <OptionalMark />
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City / town"
                      autoComplete="address-level2"
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className={labelClass}>
                      State <OptionalMark />
                    </label>
                    <select
                      id="state"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className={labelClass}>
                      Business address <RequiredMark />
                    </label>
                    <textarea
                      id="address"
                      required
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="Shop number, street, landmark"
                      autoComplete="street-address"
                      rows={4}
                      className={`${fieldClass} min-h-24 resize-y`}
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
                I agree to be contacted by MRK on call or WhatsApp about this
                application.
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Submitting..." : "Submit Dealer Application"}
                {!isLoading && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>
              <p className="mt-3.5 text-center text-[13px] text-slate-500">
                Our team usually responds within 48 hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DealerPage;
