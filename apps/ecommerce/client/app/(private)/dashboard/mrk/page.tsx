"use client";

import { withAuth } from "@/app/components/HOC/WithAuth";
import useToast from "@/app/hooks/ui/useToast";
import {
  MrkDealerApplicationStatus,
  MrkDownloadAssetPayload,
  MrkLeadStatus,
  MrkTestimonialPayload,
  useCreateAdminDealerMutation,
  useCreateAdminDownloadAssetMutation,
  useCreateAdminTestimonialMutation,
  useGetAdminContactSubmissionsQuery,
  useGetAdminDealerApplicationsQuery,
  useGetAdminDealersQuery,
  useGetAdminDownloadAssetsQuery,
  useGetAdminEnquiriesQuery,
  useGetAdminTestimonialsQuery,
  useGetSiteSettingQuery,
  useUpdateAdminContactSubmissionStatusMutation,
  useUpdateAdminDealerApplicationStatusMutation,
  useUpdateAdminEnquiryStatusMutation,
  useUpsertAdminSiteSettingMutation,
} from "@/app/store/apis/MrkApi";
import {
  Download,
  FileText,
  Loader2,
  MapPinned,
  MessageSquareText,
  Save,
  Send,
  Settings,
  Star,
  Store,
} from "lucide-react";
import React, { useState } from "react";

const leadStatuses: MrkLeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "SPAM",
];

const dealerStatuses: MrkDealerApplicationStatus[] = [
  "NEW",
  "REVIEWING",
  "APPROVED",
  "REJECTED",
  "ON_HOLD",
];

const downloadTypes: MrkDownloadAssetPayload["type"][] = [
  "CATALOG",
  "PRICE_LIST",
  "MANUAL",
  "BROCHURE",
  "CONNECTION_GUIDE",
  "VIDEO",
  "OTHER",
];

const tabs = [
  { id: "leads", label: "Leads", icon: MessageSquareText },
  { id: "dealers", label: "Dealers", icon: MapPinned },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "N/A";

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-sm border border-gray-200 bg-white p-4">
    <h2 className="mb-4 text-base font-semibold text-gray-950">{title}</h2>
    {children}
  </section>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
  />
);

const EmptyState = ({ text }: { text: string }) => (
  <p className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-4 text-sm text-gray-600">
    {text}
  </p>
);

const MrkDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("leads");

  const enquiriesQuery = useGetAdminEnquiriesQuery();
  const dealerApplicationsQuery = useGetAdminDealerApplicationsQuery();
  const contactSubmissionsQuery = useGetAdminContactSubmissionsQuery();
  const dealersQuery = useGetAdminDealersQuery();
  const downloadsQuery = useGetAdminDownloadAssetsQuery();
  const testimonialsQuery = useGetAdminTestimonialsQuery();
  const siteSettingQuery = useGetSiteSettingQuery();

  const [updateEnquiryStatus] = useUpdateAdminEnquiryStatusMutation();
  const [updateDealerApplicationStatus] =
    useUpdateAdminDealerApplicationStatusMutation();
  const [updateContactStatus] = useUpdateAdminContactSubmissionStatusMutation();
  const [createDealer, { isLoading: isCreatingDealer }] =
    useCreateAdminDealerMutation();
  const [createDownloadAsset, { isLoading: isCreatingDownload }] =
    useCreateAdminDownloadAssetMutation();
  const [createTestimonial, { isLoading: isCreatingTestimonial }] =
    useCreateAdminTestimonialMutation();
  const [upsertSiteSetting, { isLoading: isSavingSettings }] =
    useUpsertAdminSiteSettingMutation();

  const [dealerForm, setDealerForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    serviceAreas: "",
  });
  const [downloadForm, setDownloadForm] = useState({
    title: "",
    slug: "",
    type: "CATALOG" as MrkDownloadAssetPayload["type"],
    fileUrl: "",
    description: "",
    language: "EN" as MrkDownloadAssetPayload["language"],
  });
  const [testimonialForm, setTestimonialForm] = useState({
    quote: "",
    name: "",
    city: "",
    role: "DEALER" as MrkTestimonialPayload["role"],
  });
  const [settingsForm, setSettingsForm] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    gstNumber: "",
    youtubeUrl: "",
  });

  React.useEffect(() => {
    const siteSetting = siteSettingQuery.data?.siteSetting;
    if (siteSetting) {
      setSettingsForm({
        phone: siteSetting.phone || "",
        whatsapp: siteSetting.whatsapp || "",
        email: siteSetting.email || "",
        address: siteSetting.address || "",
        gstNumber: siteSetting.gstNumber || "",
        youtubeUrl: siteSetting.youtubeUrl || "",
      });
    }
  }, [siteSettingQuery.data?.siteSetting]);

  const handleStatusChange = async (
    type: "enquiry" | "dealerApplication" | "contact",
    id: string,
    status: string,
  ) => {
    try {
      if (type === "enquiry") {
        await updateEnquiryStatus({
          id,
          status: status as MrkLeadStatus,
        }).unwrap();
      } else if (type === "dealerApplication") {
        await updateDealerApplicationStatus({
          id,
          status: status as MrkDealerApplicationStatus,
        }).unwrap();
      } else {
        await updateContactStatus({
          id,
          status: status as MrkLeadStatus,
        }).unwrap();
      }
      showToast("Status updated", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to update status", "error");
    }
  };

  const handleCreateDealer = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createDealer({
        ...dealerForm,
        active: true,
        featured: false,
        serviceAreas: dealerForm.serviceAreas
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean),
      }).unwrap();
      setDealerForm({
        name: "",
        businessName: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        serviceAreas: "",
      });
      showToast("Dealer created", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to create dealer", "error");
    }
  };

  const handleCreateDownload = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createDownloadAsset({
        ...downloadForm,
        active: true,
        sortOrder: 0,
      }).unwrap();
      setDownloadForm({
        title: "",
        slug: "",
        type: "CATALOG",
        fileUrl: "",
        description: "",
        language: "EN",
      });
      showToast("Download asset created", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to create download", "error");
    }
  };

  const handleCreateTestimonial = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createTestimonial({
        ...testimonialForm,
        active: true,
        sortOrder: 0,
      }).unwrap();
      setTestimonialForm({ quote: "", name: "", city: "", role: "DEALER" });
      showToast("Testimonial created", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to create testimonial", "error");
    }
  };

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await upsertSiteSetting({ key: "global", ...settingsForm }).unwrap();
      showToast("Site settings saved", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to save settings", "error");
    }
  };

  const isLoading =
    enquiriesQuery.isLoading ||
    dealerApplicationsQuery.isLoading ||
    contactSubmissionsQuery.isLoading ||
    dealersQuery.isLoading ||
    downloadsQuery.isLoading ||
    testimonialsQuery.isLoading;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">
            MRK Management
          </h1>
          <p className="text-sm text-gray-600">
            Manage product enquiries, dealer flow, downloads, testimonials, and
            public company settings.
          </p>
        </div>
        {isLoading && (
          <span className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Loading
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold ${
              activeTab === id
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "leads" && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card title="Product Enquiries">
            {(enquiriesQuery.data?.enquiries || []).length === 0 ? (
              <EmptyState text="No enquiries yet." />
            ) : (
              <div className="space-y-3">
                {(enquiriesQuery.data?.enquiries || []).map((lead) => (
                  <div key={lead.id} className="border-b border-gray-100 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {lead.name}
                        </p>
                        <p className="text-sm text-gray-600">{lead.phone}</p>
                        <p className="text-xs text-gray-500">
                          {lead.product?.name || lead.source || "General"} -{" "}
                          {formatDate(lead.createdAt)}
                        </p>
                      </div>
                      <select
                        value={lead.status}
                        onChange={(event) =>
                          handleStatusChange(
                            "enquiry",
                            lead.id,
                            event.target.value,
                          )
                        }
                        className="rounded-sm border border-gray-300 px-2 py-1 text-xs"
                      >
                        {leadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    {lead.message && (
                      <p className="mt-2 text-sm text-gray-700">
                        {lead.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Dealer Applications">
            {(dealerApplicationsQuery.data?.dealerApplications || []).length ===
            0 ? (
              <EmptyState text="No dealer applications yet." />
            ) : (
              <div className="space-y-3">
                {(dealerApplicationsQuery.data?.dealerApplications || []).map(
                  (application) => (
                    <div
                      key={application.id}
                      className="border-b border-gray-100 pb-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {application.businessName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {application.name} - {application.mobile}
                          </p>
                          <p className="text-xs text-gray-500">
                            {application.city || "City pending"} -{" "}
                            {formatDate(application.createdAt)}
                          </p>
                        </div>
                        {(application.whatsapp ||
                          application.currentBusiness ||
                          application.experience ||
                          application.productCategories?.length ||
                          application.message) && (
                          <div className="min-w-0 flex-1 space-y-1 rounded-sm bg-gray-50 px-3 py-2 text-xs text-gray-600">
                            {application.whatsapp && (
                              <p>
                                <span className="font-semibold">WhatsApp:</span>{" "}
                                {application.whatsapp}
                              </p>
                            )}
                            {application.currentBusiness && (
                              <p>
                                <span className="font-semibold">
                                  Current business:
                                </span>{" "}
                                {application.currentBusiness}
                              </p>
                            )}
                            {application.experience && (
                              <p>
                                <span className="font-semibold">
                                  Experience:
                                </span>{" "}
                                {application.experience}
                              </p>
                            )}
                            {application.productCategories?.length ? (
                              <p>
                                <span className="font-semibold">
                                  Categories:
                                </span>{" "}
                                {application.productCategories.join(", ")}
                              </p>
                            ) : null}
                            {application.message && (
                              <p>
                                <span className="font-semibold">Message:</span>{" "}
                                {application.message}
                              </p>
                            )}
                          </div>
                        )}
                        <select
                          value={application.status}
                          onChange={(event) =>
                            handleStatusChange(
                              "dealerApplication",
                              application.id,
                              event.target.value,
                            )
                          }
                          className="rounded-sm border border-gray-300 px-2 py-1 text-xs"
                        >
                          {dealerStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </Card>

          <Card title="Contact Submissions">
            {(contactSubmissionsQuery.data?.contactSubmissions || []).length ===
            0 ? (
              <EmptyState text="No contact submissions yet." />
            ) : (
              <div className="space-y-3">
                {(contactSubmissionsQuery.data?.contactSubmissions || []).map(
                  (submission) => (
                    <div
                      key={submission.id}
                      className="border-b border-gray-100 pb-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {submission.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {submission.phone ||
                              submission.email ||
                              "No contact"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {submission.subject || "Contact"} -{" "}
                            {formatDate(submission.createdAt)}
                          </p>
                        </div>
                        <select
                          value={submission.status}
                          onChange={(event) =>
                            handleStatusChange(
                              "contact",
                              submission.id,
                              event.target.value,
                            )
                          }
                          className="rounded-sm border border-gray-300 px-2 py-1 text-xs"
                        >
                          {leadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {submission.message}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "dealers" && (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Dealer Network">
            {(dealersQuery.data?.dealers || []).length === 0 ? (
              <EmptyState text="No dealers created yet." />
            ) : (
              <div className="space-y-3">
                {(dealersQuery.data?.dealers || []).map((dealer) => (
                  <div
                    key={dealer.id}
                    className="border-b border-gray-100 pb-3"
                  >
                    <p className="font-semibold text-gray-900">
                      {dealer.businessName || dealer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {dealer.city}, {dealer.state} - {dealer.phone}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dealer.active ? "Active" : "Hidden"} -{" "}
                      {dealer.featured ? "Featured" : "Standard"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Add Dealer">
            <form onSubmit={handleCreateDealer} className="grid gap-3">
              <TextInput
                value={dealerForm.name}
                onChange={(name) =>
                  setDealerForm((prev) => ({ ...prev, name }))
                }
                placeholder="Dealer name"
              />
              <TextInput
                value={dealerForm.businessName}
                onChange={(businessName) =>
                  setDealerForm((prev) => ({ ...prev, businessName }))
                }
                placeholder="Business name optional"
              />
              <TextInput
                value={dealerForm.phone}
                onChange={(phone) =>
                  setDealerForm((prev) => ({ ...prev, phone }))
                }
                placeholder="Phone"
              />
              <TextInput
                value={dealerForm.whatsapp}
                onChange={(whatsapp) =>
                  setDealerForm((prev) => ({ ...prev, whatsapp }))
                }
                placeholder="WhatsApp optional"
              />
              <TextInput
                value={dealerForm.email}
                onChange={(email) =>
                  setDealerForm((prev) => ({ ...prev, email }))
                }
                placeholder="Email optional"
              />
              <textarea
                value={dealerForm.address}
                onChange={(event) =>
                  setDealerForm((prev) => ({
                    ...prev,
                    address: event.target.value,
                  }))
                }
                placeholder="Address"
                rows={3}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <TextInput
                  value={dealerForm.city}
                  onChange={(city) =>
                    setDealerForm((prev) => ({ ...prev, city }))
                  }
                  placeholder="City"
                />
                <TextInput
                  value={dealerForm.state}
                  onChange={(state) =>
                    setDealerForm((prev) => ({ ...prev, state }))
                  }
                  placeholder="State"
                />
                <TextInput
                  value={dealerForm.pincode}
                  onChange={(pincode) =>
                    setDealerForm((prev) => ({ ...prev, pincode }))
                  }
                  placeholder="Pincode"
                />
              </div>
              <TextInput
                value={dealerForm.serviceAreas}
                onChange={(serviceAreas) =>
                  setDealerForm((prev) => ({ ...prev, serviceAreas }))
                }
                placeholder="Service areas, comma separated"
              />
              <button
                disabled={isCreatingDealer}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
              >
                <Store size={17} />
                {isCreatingDealer ? "Saving..." : "Create Dealer"}
              </button>
            </form>
          </Card>
        </div>
      )}

      {activeTab === "downloads" && (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Download Assets">
            {(downloadsQuery.data?.downloadAssets || []).length === 0 ? (
              <EmptyState text="No download assets created yet." />
            ) : (
              <div className="space-y-3">
                {(downloadsQuery.data?.downloadAssets || []).map((asset) => (
                  <div key={asset.id} className="border-b border-gray-100 pb-3">
                    <p className="font-semibold text-gray-900">{asset.title}</p>
                    <p className="text-sm text-gray-600">
                      {asset.type} - {asset.language}
                    </p>
                    <a
                      href={asset.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-700 hover:underline"
                    >
                      {asset.fileUrl}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Add Download">
            <form onSubmit={handleCreateDownload} className="grid gap-3">
              <TextInput
                value={downloadForm.title}
                onChange={(title) =>
                  setDownloadForm((prev) => ({ ...prev, title }))
                }
                placeholder="Title"
              />
              <TextInput
                value={downloadForm.slug}
                onChange={(slug) =>
                  setDownloadForm((prev) => ({ ...prev, slug }))
                }
                placeholder="Slug"
              />
              <select
                value={downloadForm.type}
                onChange={(event) =>
                  setDownloadForm((prev) => ({
                    ...prev,
                    type: event.target.value as MrkDownloadAssetPayload["type"],
                  }))
                }
                className="rounded-sm border border-gray-300 px-3 py-2 text-sm"
              >
                {downloadTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <TextInput
                value={downloadForm.fileUrl}
                onChange={(fileUrl) =>
                  setDownloadForm((prev) => ({ ...prev, fileUrl }))
                }
                placeholder="File URL"
              />
              <textarea
                value={downloadForm.description}
                onChange={(event) =>
                  setDownloadForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Description optional"
                rows={3}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                disabled={isCreatingDownload}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
              >
                <FileText size={17} />
                {isCreatingDownload ? "Saving..." : "Create Download"}
              </button>
            </form>
          </Card>
        </div>
      )}

      {activeTab === "testimonials" && (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Testimonials">
            {(testimonialsQuery.data?.testimonials || []).length === 0 ? (
              <EmptyState text="No testimonials created yet." />
            ) : (
              <div className="space-y-3">
                {(testimonialsQuery.data?.testimonials || []).map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-3">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.role} - {item.city || "City pending"}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">{item.quote}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Add Testimonial">
            <form onSubmit={handleCreateTestimonial} className="grid gap-3">
              <textarea
                value={testimonialForm.quote}
                onChange={(event) =>
                  setTestimonialForm((prev) => ({
                    ...prev,
                    quote: event.target.value,
                  }))
                }
                placeholder="Quote"
                rows={4}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <TextInput
                value={testimonialForm.name}
                onChange={(name) =>
                  setTestimonialForm((prev) => ({ ...prev, name }))
                }
                placeholder="Name"
              />
              <TextInput
                value={testimonialForm.city}
                onChange={(city) =>
                  setTestimonialForm((prev) => ({ ...prev, city }))
                }
                placeholder="City optional"
              />
              <select
                value={testimonialForm.role}
                onChange={(event) =>
                  setTestimonialForm((prev) => ({
                    ...prev,
                    role: event.target.value as MrkTestimonialPayload["role"],
                  }))
                }
                className="rounded-sm border border-gray-300 px-3 py-2 text-sm"
              >
                {["DEALER", "FARMER", "HOMEOWNER", "OTHER"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                disabled={isCreatingTestimonial}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
              >
                <Send size={17} />
                {isCreatingTestimonial ? "Saving..." : "Create Testimonial"}
              </button>
            </form>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <Card title="Public Site Settings">
          <form onSubmit={handleSaveSettings} className="grid max-w-3xl gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                value={settingsForm.phone}
                onChange={(phone) =>
                  setSettingsForm((prev) => ({ ...prev, phone }))
                }
                placeholder="Phone"
              />
              <TextInput
                value={settingsForm.whatsapp}
                onChange={(whatsapp) =>
                  setSettingsForm((prev) => ({ ...prev, whatsapp }))
                }
                placeholder="WhatsApp number"
              />
              <TextInput
                value={settingsForm.email}
                onChange={(email) =>
                  setSettingsForm((prev) => ({ ...prev, email }))
                }
                placeholder="Email"
              />
              <TextInput
                value={settingsForm.gstNumber}
                onChange={(gstNumber) =>
                  setSettingsForm((prev) => ({ ...prev, gstNumber }))
                }
                placeholder="GST number"
              />
            </div>
            <TextInput
              value={settingsForm.youtubeUrl}
              onChange={(youtubeUrl) =>
                setSettingsForm((prev) => ({ ...prev, youtubeUrl }))
              }
              placeholder="YouTube URL optional"
            />
            <textarea
              value={settingsForm.address}
              onChange={(event) =>
                setSettingsForm((prev) => ({
                  ...prev,
                  address: event.target.value,
                }))
              }
              placeholder="Address"
              rows={3}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <button
              disabled={isSavingSettings}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
            >
              <Save size={17} />
              {isSavingSettings ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default withAuth(MrkDashboard);
