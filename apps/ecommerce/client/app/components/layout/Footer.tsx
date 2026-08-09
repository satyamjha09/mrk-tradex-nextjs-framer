"use client";

import React from "react";
import Link from "next/link";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
  { href: "/downloads", label: "Downloads" },
  { href: "/find-dealer", label: "Find Dealer" },
  { href: "/dealer", label: "Become Dealer" },
  { href: "/contact", label: "Contact" },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { company, urls } = useMrkSiteSettings();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 hover:text-black"
            >
              {company.name}
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed">
              {company.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              {company.address}
            </p>
          </div>

          <nav aria-label="Footer" className="max-w-md">
            <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-black transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={urls.phone} className="hover:text-black">
                {company.phone}
              </a>
              <a href={urls.email} className="hover:text-black">
                {company.email}
              </a>
              <a
                href={urls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black"
              >
                WhatsApp
              </a>
              {company.youtubeUrl && (
                <a
                  href={company.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black"
                >
                  YouTube
                </a>
              )}
            </div>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-gray-200 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {company.name}. All rights reserved.
          </p>
          <p>GST: {company.gstNumber}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
