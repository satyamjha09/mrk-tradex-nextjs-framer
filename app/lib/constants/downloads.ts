/**
 * The PDFs shipped in public/ — the single source for every place that offers
 * them (navbar dropdown, footer). Paths are the filenames, encoded because both
 * carry spaces.
 *
 * These are static files, deliberately separate from the API-backed
 * `downloadAssets` behind /downloads: that list is empty until someone
 * publishes assets in the admin, and these two should not depend on it.
 *
 * `fileName` is what the browser saves the file as — otherwise it takes the raw
 * basename, and "MRK Phamplet.pdf" reads as a typo to whoever receives it.
 */
export type SiteDownload = {
  href: string;
  fileName: string;
  label: string;
  hi: string;
  size: string;
  /** Matches the DOWNLOAD_TYPE enum so /downloads can list these beside the
   *  API-backed assets and filter them by the same control. */
  type: "PRICE_LIST" | "CATALOG";
  description: string;
};

export const SITE_DOWNLOADS: SiteDownload[] = [
  {
    href: "/USER%20MRK%20PRICE%20LIST.pdf",
    fileName: "USER MRK PRICE LIST.pdf",
    label: "MRK Price List",
    hi: "मूल्य सूची",
    size: "5.4 MB PDF",
    type: "PRICE_LIST",
    description:
      "Current MRK price register covering every starter panel series.",
  },
  {
    href: "/MRK%20Phamplet.pdf",
    fileName: "MRK Catalog.pdf",
    label: "MRK Catalog",
    hi: "कैटलॉग",
    size: "11.3 MB PDF",
    type: "CATALOG",
    description:
      "Full product catalogue: single-phase, three-phase, WLC and switchgear.",
  },
];
