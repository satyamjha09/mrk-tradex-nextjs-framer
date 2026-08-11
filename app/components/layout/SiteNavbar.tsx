// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE_DOWNLOADS } from "@/app/lib/constants/downloads";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Products" },
  { href: "/#why", label: "Why MRK" },
  { href: "/contact", label: "Contact" },
];

// Shared with the footer so both offer the same files. Sizes are shown because
// these are large on a mobile connection.
const downloads = SITE_DOWNLOADS;

export default function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <header className="sticky top-0 z-[80] border-b border-slate-200/70 bg-white/92 shadow-[0_1px_18px_rgba(15,35,65,0.06)] backdrop-blur-xl">
      <nav className="mx-auto flex h-[60px] w-full max-w-[1740px] items-center justify-between px-4 sm:h-[64px] sm:px-8 lg:h-[68px] lg:px-10 xl:px-14">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label="MRK home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/mrk-logo.png"
            alt="MRK"
            width={100}
            height={46}
            priority
            className="h-auto w-[82px] object-contain sm:w-[92px] lg:w-[100px]"
          />
        </Link>

        <div className="hidden items-center gap-6 text-[15px] font-bold text-[#0b1f33] lg:flex xl:gap-8 xl:text-base">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#1e9be0]"
            >
              {link.label}
            </Link>
          ))}

          {/* Opens on hover, and on keyboard focus too — a hover-only menu is
              unreachable by tab. The panel's pt-3 is the bridge the pointer
              crosses on its way down, so the menu does not close mid-travel. */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 font-bold transition-colors hover:text-[#1e9be0] group-hover:text-[#1e9be0] group-focus-within:text-[#1e9be0]"
              aria-haspopup="menu"
            >
              Download
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
              />
            </button>

            <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div
                className="min-w-[248px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,35,65,0.14)]"
                role="menu"
              >
                {downloads.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    download={item.fileName}
                    role="menuitem"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e9be0]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#1e9be0]">
                      <Download size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[#0b1f33]">
                        {item.label}
                      </span>
                      <span className="block text-xs font-medium text-slate-500">
                        {item.size}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 items-center justify-end gap-3 lg:flex xl:min-w-[218px] xl:gap-3.5">
          {/* Language toggle parked until the Hindi copy is wired up. */}
          {/* <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-[#0b1f33] shadow-sm transition-colors hover:border-[#1e9be0] hover:text-[#1e9be0] xl:h-10 xl:w-10 xl:text-base"
            aria-label="Switch language"
          >
            हिं
          </button> */}
          <Link
            href="/dealer"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-[#1e9be0] px-5 text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(30,155,224,0.28)] transition-colors hover:bg-[#1583bd] xl:h-10 xl:px-6 xl:text-base"
          >
            Partner with us
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1f33] sm:h-11 sm:w-11 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-[0_18px_36px_rgba(15,35,65,0.08)] sm:px-6 sm:py-5 lg:hidden">
          <div className="flex flex-col gap-4 text-base font-bold text-[#0b1f33]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 hover:text-[#1e9be0]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* No hover on touch, so the dropdown's two items are listed flat. */}
            <div className="mt-1 border-t border-slate-100 pt-3">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Download
              </span>
              <div className="mt-1 flex flex-col">
                {downloads.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    download={item.fileName}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#1e9be0]">
                      <Download size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[#0b1f33]">
                        {item.label}
                      </span>
                      <span className="block text-xs font-medium text-slate-500">
                        {item.size}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3">
              {/* Language toggle parked until the Hindi copy is wired up. */}
              {/* <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-bold text-[#0b1f33]"
                aria-label="Switch language"
              >
                हिं
              </button> */}
              <Link
                href="/dealer"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#1e9be0] px-5 text-sm font-extrabold text-white"
                onClick={() => setOpen(false)}
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
