"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import {
  MrkDownloadAsset,
  useGetPublicDownloadAssetsQuery,
} from "@/app/store/apis/MrkApi";
import {
  Download,
  FileText,
  Loader2,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

const DOWNLOAD_TYPE_LABELS: Record<MrkDownloadAsset["type"], string> = {
  CATALOG: "Catalogue",
  PRICE_LIST: "Price list",
  MANUAL: "Manual",
  BROCHURE: "Brochure",
  CONNECTION_GUIDE: "Connection guide",
  VIDEO: "Video",
  OTHER: "Other",
};

const DownloadsPage = () => {
  const { data, isLoading, isError } = useGetPublicDownloadAssetsQuery();
  const { urls } = useMrkSiteSettings();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<MrkDownloadAsset["type"] | "ALL">("ALL");

  const assets = data?.downloadAssets || [];
  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesType = type === "ALL" || asset.type === type;
      const searchable = [
        asset.title,
        asset.description,
        asset.product?.name,
        asset.product?.modelNumber,
        asset.variant?.sku,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesType &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [assets, query, type]);

  const availableTypes = useMemo(() => {
    return Array.from(new Set(assets.map((asset) => asset.type)));
  }, [assets]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold text-gray-950">Downloads</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Find MRK catalogues, price lists, manuals, brochures, and
              connection guides for product selection and installation.
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap gap-2">
            <a
              href={urls.phone}
              className="inline-flex items-center gap-2 rounded-sm border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-black hover:text-black"
            >
              <Phone size={17} />
              Call
            </a>
            <a
              href={urls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mb-6 grid min-w-0 gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block min-w-0">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search downloads by title, product, model, or SKU"
              className="w-full rounded-sm border border-gray-300 py-3 pl-10 pr-3 text-sm focus:border-black focus:outline-none"
            />
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as MrkDownloadAsset["type"] | "ALL")
            }
            className="w-full min-w-0 rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
          >
            <option value="ALL">All types</option>
            {availableTypes.map((assetType) => (
              <option key={assetType} value={assetType}>
                {DOWNLOAD_TYPE_LABELS[assetType]}
              </option>
            ))}
          </select>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 py-10 text-sm text-gray-600">
            <Loader2 size={18} className="animate-spin" />
            Loading downloads
          </div>
        )}

        {isError && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Downloads could not be loaded right now.
          </div>
        )}

        {!isLoading && !isError && filteredAssets.length === 0 && (
          <div className="border border-gray-200 bg-white px-4 py-8 text-sm text-gray-600">
            No matching downloads are published yet. Contact MRK for the latest
            catalogue, price list, manual, or connection guide.
          </div>
        )}

        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => (
            <article
              key={asset.id}
              className="min-w-0 rounded-sm border border-gray-200 bg-white p-4"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 text-black">
                    <FileText size={20} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-950">
                      {asset.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                      {DOWNLOAD_TYPE_LABELS[asset.type]} - {asset.language}
                    </p>
                  </div>
                </div>
              </div>

              {asset.description && (
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  {asset.description}
                </p>
              )}

              <dl className="mb-4 grid gap-2 text-sm text-gray-700">
                {asset.product && (
                  <div className="flex min-w-0 justify-between gap-3">
                    <dt className="text-gray-500">Product</dt>
                    <dd className="min-w-0 text-right font-medium">
                      {asset.product.name}
                    </dd>
                  </div>
                )}
                {asset.variant && (
                  <div className="flex min-w-0 justify-between gap-3">
                    <dt className="text-gray-500">Variant</dt>
                    <dd className="min-w-0 text-right font-medium">
                      {asset.variant.sku}
                    </dd>
                  </div>
                )}
                {asset.version && (
                  <div className="flex min-w-0 justify-between gap-3">
                    <dt className="text-gray-500">Version</dt>
                    <dd className="min-w-0 text-right font-medium">
                      {asset.version}
                    </dd>
                  </div>
                )}
              </dl>

              <a
                href={asset.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gray-950 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                <Download size={17} />
                Download
              </a>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DownloadsPage;
