"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { MrkDealer, useGetPublicDealersQuery } from "@/app/store/apis/MrkApi";
import {
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const getDealerWhatsappUrl = (dealer: MrkDealer, fallbackUrl: string) => {
  const number = dealer.whatsapp || dealer.phone;
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : fallbackUrl;
};

const FindDealerPage = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const { urls } = useMrkSiteSettings();
  const { data, isLoading, isError } = useGetPublicDealersQuery({
    city: city || undefined,
    state: state || undefined,
  });

  const dealers = data?.dealers || [];
  const featuredDealers = useMemo(
    () => dealers.filter((dealer) => dealer.featured),
    [dealers],
  );

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold text-gray-950">
              Find a Dealer
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Locate active MRK dealers for pump starters, panels, smart plugs,
              cables, accessories, and local product support.
            </p>
          </div>

          <Link
            href="/dealer"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Store size={18} />
            Become Dealer
          </Link>
        </div>

        <div className="mb-6 grid min-w-0 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="relative block min-w-0">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Filter by city"
              className="w-full rounded-sm border border-gray-300 py-3 pl-10 pr-3 text-sm focus:border-black focus:outline-none"
            />
          </label>
          <input
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="Filter by state"
            className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setCity("");
              setState("");
            }}
            className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:border-black hover:text-black md:w-auto"
          >
            Clear
          </button>
        </div>

        {featuredDealers.length > 0 && (
          <div className="mb-5 text-sm font-medium text-gray-700">
            Featured dealers: {featuredDealers.length}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 py-10 text-sm text-gray-600">
            <Loader2 size={18} className="animate-spin" />
            Loading dealers
          </div>
        )}

        {isError && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Dealer list could not be loaded right now.
          </div>
        )}

        {!isLoading && !isError && dealers.length === 0 && (
          <div className="border border-gray-200 bg-white px-4 py-8 text-sm text-gray-600">
            No active dealer is published for this location yet. Contact MRK
            directly and the team will help with availability.
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={urls.phone}
                className="inline-flex items-center gap-2 rounded-sm border border-gray-300 px-3 py-2 font-semibold text-gray-800 hover:border-black hover:text-black"
              >
                <Phone size={17} />
                Call
              </a>
              <a
                href={urls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          {dealers.map((dealer) => (
            <article
              key={dealer.id}
              className="min-w-0 rounded-sm border border-gray-200 bg-white p-4"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 text-black">
                    <Store size={20} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-950">
                      {dealer.businessName || dealer.name}
                    </h2>
                    {dealer.contactPerson && (
                      <p className="mt-1 text-sm text-gray-600">
                        {dealer.contactPerson}
                      </p>
                    )}
                  </div>
                </div>
                {dealer.featured && (
                  <span className="rounded-sm bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    Featured
                  </span>
                )}
              </div>

              <p className="mb-4 flex items-start gap-2 text-sm leading-relaxed text-gray-700">
                <MapPin
                  size={17}
                  className="mt-0.5 flex-shrink-0 text-gray-500"
                />
                <span>
                  {dealer.address}, {dealer.city}
                  {dealer.district ? `, ${dealer.district}` : ""},{" "}
                  {dealer.state} {dealer.pincode}
                </span>
              </p>

              {dealer.serviceAreas.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {dealer.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${dealer.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-black hover:text-black"
                >
                  <Phone size={17} />
                  Call
                </a>
                <a
                  href={getDealerWhatsappUrl(dealer, urls.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
                {dealer.email && (
                  <a
                    href={`mailto:${dealer.email}`}
                    className="inline-flex items-center gap-2 rounded-sm border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-black hover:text-black"
                  >
                    <Mail size={17} />
                    Email
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default FindDealerPage;
