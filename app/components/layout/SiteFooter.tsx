// @ts-nocheck
"use client";

import Link from "next/link";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { shopUrl } from "@/app/data/catalog/series";

/**
 * The one footer for the whole site. This is the home page's design, lifted out
 * of MrkHome so every route renders the same thing.
 *
 * It keeps id="contact" because in-page CTAs (the dealer section, the nav)
 * scroll to it.
 *
 * Home-page-only hash links from the original markup are now real routes, since
 * the footer renders on pages where those anchors do not exist.
 */

const productLinks = [
  { label: "I-Phase Starters", hi: "सिंगल-फेज़ स्टार्टर", href: shopUrl("single-phase-starter") },
  { label: "III-Phase Panels", hi: "थ्री-फेज़ पैनल", href: shopUrl("three-phase-panel") },
  { label: "WLC Smart Plugs", hi: "WLC स्मार्ट प्लग", href: shopUrl("wlc-smart-plug") },
  { label: "Switch Gears", hi: "स्विच गियर", href: shopUrl("cables-accessories") },
];

const companyLinks = [
  { label: "Why MRK", hi: "MRK क्यों", href: "/#why" },
  { label: "Become a Dealer", hi: "डीलर बनें", href: "/dealer" },
  { label: "Find a Dealer", hi: "डीलर खोजें", href: "/find-dealer" },
];

const SiteFooter = () => {
  const { company, urls } = useMrkSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative border-t-2 border-aqua/30 bg-ink pb-8 pt-8 text-white [&_address]:not-italic [&_address]:text-sm [&_address]:leading-7 [&_address]:text-white/70 [&_h5]:mb-3 [&_h5]:font-mono [&_h5]:text-[0.72rem] [&_h5]:uppercase [&_h5]:tracking-[0.14em] [&_h5]:text-white/60 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-2.5 [&_ul]:p-0 [&_ul_a]:text-sm [&_ul_a]:text-white/75 [&_ul_a:hover]:text-white"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-8 py-[clamp(3.5rem,7vw,5rem)] pb-10 max-[1000px]:grid-cols-2 max-[720px]:grid-cols-1">
          <div>
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 font-sans text-[1.4rem] font-semibold text-white"
            >
              <img
                className="h-[34px] w-auto"
                src="/images/mrk-logo.png"
                alt={company.name}
              />
              Tradex Pvt Ltd
            </Link>

            <div
              className="mb-5 text-base italic text-white"
              data-hi="पानी ही जीवन है, और हम आपके जीवन को पानी से भरते हैं।"
            >
              {company.tagline}
            </div>

            <address>
              {company.address}
              <br />
              <a href={urls.phone}>{company.phone}</a>
              <br />
              <a href={urls.email}>{company.email}</a>
            </address>
          </div>

          <div>
            <h5 data-hi="उत्पाद">Products</h5>
            <ul>
              {productLinks.map(({ label, hi, href }) => (
                <li key={label}>
                  <Link href={href} data-hi={hi}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 data-hi="कंपनी">Company</h5>
            <ul>
              {companyLinks.map(({ label, hi, href }) => (
                <li key={label}>
                  <Link href={href} data-hi={hi}>
                    {label}
                  </Link>
                </li>
              ))}
              {company.youtubeUrl && (
                <li>
                  <a
                    href={company.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h5 data-hi="संपर्क करें">Get in touch</h5>
            <ul>
              <li>
                <a href={urls.phone} data-hi="कॉल करें">
                  Call us
                </a>
              </li>
              <li>
                <a
                  href={urls.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/contact" data-hi="संपर्क">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/find-dealer" data-hi="डीलर खोजें">
                  Find a dealer
                </Link>
              </li>
              <li>
                <Link href="/downloads" data-hi="डाउनलोड">
                  Downloads
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-white/15 pt-4 text-sm text-white/70">
          <span>
            &copy; {currentYear} {company.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
