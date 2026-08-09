// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle,
  FileDown,
  Home,
  MapPinned,
  MessageCircle,
  PackageSearch,
} from "lucide-react";
import MainLayout from "@/app/components/templates/MainLayout";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";

const SuccessPage = () => {
  const { urls } = useMrkSiteSettings();

  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-sm bg-green-50 text-green-700">
          <CheckCircle size={38} />
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
          Request Received
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
          Thank you for contacting MRK. Our team will review your requirement
          and respond with product guidance, dealer support, catalogue details,
          or pricing information as applicable.
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <PackageSearch size={18} />
            View Catalog
          </Link>
          <a
            href={urls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-black px-5 py-3 text-sm font-semibold text-black hover:bg-gray-100"
          >
            <MessageCircle size={18} />
            WhatsApp MRK
          </a>
          <Link
            href="/find-dealer"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 hover:border-black hover:text-black"
          >
            <MapPinned size={18} />
            Find Dealer
          </Link>
          <Link
            href="/downloads"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 hover:border-black hover:text-black"
          >
            <FileDown size={18} />
            Downloads
          </Link>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black"
        >
          <Home size={16} />
          Back to home
        </Link>
      </section>
    </MainLayout>
  );
};

export default SuccessPage;
