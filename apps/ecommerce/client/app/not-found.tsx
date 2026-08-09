"use client";

import {
  ArrowLeft,
  Download,
  Home,
  MapPinned,
  Package,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const popularCategories = [
  { name: "Single Phase Starters", href: "/products?phase=SINGLE_PHASE" },
  { name: "Three Phase Panels", href: "/products?phase=THREE_PHASE" },
  { name: "Smart Controls", href: "/products?search=smart" },
  { name: "Cables & Accessories", href: "/products?search=cable" },
];

const quickLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Catalog", href: "/products", icon: Package },
  { name: "Find Dealer", href: "/find-dealer", icon: MapPinned },
  { name: "Downloads", href: "/downloads", icon: Download },
];

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-black sm:px-8">
      <div className="w-full max-w-4xl">
        <div className="mb-10 inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
          MRK Tradex
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <section>
            <p className="text-8xl font-black leading-none text-black sm:text-9xl">
              404
            </p>
            <h1 className="mt-6 text-4xl font-black tracking-normal sm:text-5xl">
              This page is not in the MRK catalog.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Search by product family, model number, HP range, phase, or
              technical keyword. You can also jump straight to dealer and
              download pages.
            </p>

            <form onSubmit={handleSearch} className="mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, models, HP..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-14 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-32 text-sm font-medium text-black outline-none transition-colors focus:border-black focus:bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 inline-flex h-10 -translate-y-1/2 items-center justify-center rounded-full bg-black px-5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap gap-3">
              {popularCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
              >
                Contact MRK
              </Link>
            </div>
          </section>

          <aside className="rounded-[18px] border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-black">Quick Navigation</h2>
            <div className="mt-5 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm font-bold text-black shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                    <link.icon className="h-4 w-4" />
                  </span>
                  {link.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
