"use client";

import { usePathname } from "next/navigation";
import { MRK_COMPANY } from "@/app/lib/constants/mrk";

const hiddenPathPrefixes = ["/dashboard", "/sign-in", "/sign-up", "/reset-password"];

export default function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const shouldHide = hiddenPathPrefixes.some((prefix) => pathname?.startsWith(prefix));

  if (shouldHide) {
    return null;
  }

  const digits = MRK_COMPANY.whatsappNumber.replace(/\D/g, "");
  const message = encodeURIComponent("Hi MRK Tradex, I want to chat about your products.");
  const href = `https://wa.me/${digits}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MRK on WhatsApp"
      className="fixed bottom-[92px] right-5 z-[2147482900] flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 text-white shadow-[0_12px_30px_rgba(18,140,126,0.28)] transition duration-200 hover:-translate-y-1 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 max-[520px]:h-14 max-[520px]:w-14 max-[520px]:justify-center max-[520px]:px-0"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-7 w-7 flex-none"
        fill="currentColor"
      >
        <path d="M16.01 3.2c-7.05 0-12.78 5.63-12.78 12.56 0 2.22.6 4.4 1.72 6.3L3.2 28.8l6.93-1.67a13 13 0 0 0 5.88 1.42c7.05 0 12.79-5.63 12.79-12.56S23.06 3.2 16.01 3.2Zm0 23.2c-1.87 0-3.7-.49-5.31-1.42l-.38-.22-4.12.99 1.04-3.98-.25-.4a10.38 10.38 0 0 1-1.6-5.6c0-5.75 4.77-10.42 10.62-10.42 5.86 0 10.63 4.67 10.63 10.42S21.87 26.4 16.01 26.4Zm5.98-7.8c-.33-.16-1.94-.94-2.24-1.05-.3-.1-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.21-.38.24-.71.08-.33-.16-1.39-.5-2.65-1.61-.98-.86-1.64-1.92-1.83-2.24-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.56.16-.19.22-.32.33-.53.11-.21.05-.4-.03-.56-.08-.16-.74-1.76-1.01-2.4-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.32-1.14 1.1-1.14 2.68 0 1.58 1.17 3.1 1.34 3.31.16.21 2.31 3.47 5.59 4.87.78.33 1.39.53 1.87.68.79.25 1.5.21 2.07.13.63-.09 1.94-.78 2.21-1.53.27-.75.27-1.39.19-1.53-.08-.14-.3-.22-.63-.38Z" />
      </svg>
      <span className="flex flex-col leading-tight max-[520px]:hidden">
        <span className="text-sm font-bold">Chat on WhatsApp</span>
        <span className="text-xs font-medium text-white/90">+91 93197 19670</span>
      </span>
    </a>
  );
}
