"use client";

import Link from "next/link";

type FormConsentTextProps = {
  className?: string;
  linkClassName?: string;
};

export default function FormConsentText({
  className,
  linkClassName,
}: FormConsentTextProps) {
  return (
    <span className={className}>
      By submitting this form, you agree to our{" "}
      <Link
        href="/privacy-policy"
        className={
          linkClassName ??
          "font-semibold text-blue-700 underline underline-offset-2"
        }
      >
        Privacy Policy
      </Link>{" "}
      and consent to MRK Tradex contacting you regarding your enquiry through
      call, WhatsApp, SMS or email.
    </span>
  );
}
