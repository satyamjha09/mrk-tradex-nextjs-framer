// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Products" },
  { href: "/#why", label: "Why MRK" },
  { href: "/contact", label: "Contact" },
];

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
        </div>

        <div className="hidden min-w-0 items-center justify-end gap-3 lg:flex xl:min-w-[218px] xl:gap-3.5">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-[#0b1f33] shadow-sm transition-colors hover:border-[#1e9be0] hover:text-[#1e9be0] xl:h-10 xl:w-10 xl:text-base"
            aria-label="Switch language"
          >
            हिं
          </button>
          <Link
            href="/dealer"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-[#0b1f33] px-5 text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(11,31,51,0.18)] transition-colors hover:bg-[#12315e] xl:h-10 xl:px-6 xl:text-base"
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
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-bold text-[#0b1f33]"
                aria-label="Switch language"
              >
                हिं
              </button>
              <Link
                href="/dealer"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#0b1f33] px-5 text-sm font-extrabold text-white"
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
