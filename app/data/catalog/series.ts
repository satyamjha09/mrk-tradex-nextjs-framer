// @ts-nocheck
/**
 * Catalog taxonomy — the two-level browse structure used on /shop.
 *
 * Level 1 is the panel type (I-Phase / III-Phase / WLC Smart Plug), which maps
 * onto a real Category row via slug. Level 2 is the lettered series inside it
 * (A. AHD, B. MHD, C. MRD ...), which has no table of its own — a product joins
 * a series when one of the series' `match` tokens turns up in its modelNumber,
 * productSeries, name, or slug.
 *
 * The lists below are transcribed from the MRK product register, so they stay
 * put even when the catalog data is incomplete. Matching is always scoped to
 * the selected category, so a short token like "DOL" cannot pull a single-phase
 * starter into the three-phase DOL series.
 */

export type CatalogSeries = {
  /** URL value and stable id, e.g. "AHD". */
  code: string;
  /** Register letter shown on the chip, e.g. "A". */
  letter: string;
  label: string;
  /** Model numbers listed under this series — shown as a hint under the chip row. */
  models: string[];
  /** Case-insensitive tokens matched against a product's identifying fields. */
  match: string[];
};

export type CatalogGroup = {
  /** URL value, e.g. "single-phase-starter". */
  key: string;
  label: string;
  shortLabel: string;
  /** Category slugs this group resolves to, most preferred first. */
  categorySlugs: string[];
  /** How the series level is labelled for this group — the register letters
   *  the panels, but the WLC plugs are numbered model names instead. */
  seriesLabel: string;
  series: CatalogSeries[];
};

export const CATALOG_GROUPS: CatalogGroup[] = [
  {
    key: "single-phase-starter",
    label: "I-Phase Starter Panel",
    shortLabel: "I-Phase",
    categorySlugs: ["single-phase-starters"],
    seriesLabel: "Series",
    series: [
      {
        code: "AHD",
        letter: "A",
        label: "AHD Series",
        models: ["AHD246", "AHD29A"],
        match: ["AHD"],
      },
      {
        code: "MHD",
        letter: "B",
        label: "MHD Series",
        models: ["MHD34B"],
        match: ["MHD"],
      },
      {
        code: "MRD",
        letter: "C",
        label: "MRD Series",
        models: ["MRD16A"],
        match: ["MRD"],
      },
      {
        code: "MRG",
        letter: "D",
        label: "MRG Series",
        models: ["MRG16A", "MRG29A"],
        match: ["MRG"],
      },
      {
        code: "PRD",
        letter: "E",
        label: "PRD Series",
        models: [],
        match: ["PRD"],
      },
    ],
  },
  {
    key: "three-phase-panel",
    label: "III-Phase Starter Panel",
    shortLabel: "III-Phase",
    categorySlugs: ["three-phase-panels"],
    seriesLabel: "Series",
    series: [
      {
        code: "DOL",
        letter: "A",
        label: "DOL Series",
        models: ["DOL MRX-01"],
        match: ["DOL", "MRX-01"],
      },
      {
        code: "STAR-DELTA",
        letter: "B",
        label: "Star Delta Series",
        models: ["MRX-HD F04"],
        match: ["STAR DELTA", "STAR-DELTA", "MRX-HD"],
      },
    ],
  },
  {
    key: "wlc-smart-plug",
    label: "WLC Smart Plug",
    shortLabel: "WLC",
    categorySlugs: ["smart-controls"],
    seriesLabel: "Model",
    series: [
      {
        code: "SSO",
        letter: "1",
        label: "SSO",
        models: ["SSO — 220V, 15 Amp"],
        match: ["SSO"],
      },
      {
        code: "TSO",
        letter: "2",
        label: "TSO",
        models: ["TSO — 220V, 15 Amp"],
        match: ["TSO"],
      },
      {
        code: "WIFI",
        letter: "3",
        label: "WiFi",
        models: ["WIFI — 220V, 15 Amp"],
        match: ["WIFI", "WI-FI"],
      },
    ],
  },
  {
    key: "cables-accessories",
    // Labelled to match the "Switch Gears" card on the home page, which is the
    // entry point into this group. The underlying category row is still
    // "Cables & Accessories" — the slug in categorySlugs is what binds them.
    label: "Switch Gears",
    shortLabel: "Switch Gears",
    categorySlugs: ["cables-accessories"],
    seriesLabel: "Type",
    series: [],
  },
];

export function getGroupByKey(key?: string | null): CatalogGroup | undefined {
  if (!key) return undefined;
  return CATALOG_GROUPS.find((group) => group.key === key);
}

/** Resolve a group to the live category row so we can filter by categoryId. */
export function findCategoryForGroup(
  categories: Array<{ id: string; slug: string }>,
  group?: CatalogGroup,
) {
  if (!group) return undefined;
  for (const slug of group.categorySlugs) {
    const match = categories.find((category) => category.slug === slug);
    if (match) return match;
  }
  return undefined;
}

/** Reverse lookup, so a categoryId arriving in the URL lights up the right chip. */
export function findGroupForCategoryId(
  categories: Array<{ id: string; slug: string }>,
  categoryId?: string | null,
): CatalogGroup | undefined {
  if (!categoryId) return undefined;
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return undefined;
  return CATALOG_GROUPS.find((group) =>
    group.categorySlugs.includes(category.slug),
  );
}

export function getSeries(
  groupKey?: string | null,
  code?: string | null,
): CatalogSeries | undefined {
  if (!code) return undefined;
  const group = getGroupByKey(groupKey);
  if (!group) return undefined;
  return group.series.find((series) => series.code === code);
}

/**
 * Tokens the query should match on. Sent to the API as `seriesMatch` and used
 * directly by the demo catalog filter.
 */
export function getSeriesMatchTokens(
  groupKey?: string | null,
  code?: string | null,
): string[] | undefined {
  const series = getSeries(groupKey, code);
  return series?.match.length ? series.match : undefined;
}

/**
 * Deep-link into the catalog with a category — and optionally a series —
 * already selected. Unknown keys fall back to the plain catalog rather than
 * producing a URL the shop cannot resolve, so a rename here degrades to an
 * unfiltered listing instead of an empty one.
 */
export function shopUrl(groupKey?: string, seriesCode?: string): string {
  const group = getGroupByKey(groupKey);
  if (!group) return "/shop";

  const series = getSeries(group.key, seriesCode);
  return series
    ? `/shop?group=${group.key}&series=${series.code}`
    : `/shop?group=${group.key}`;
}

/** Client-side equivalent of the resolver's seriesMatch clause. */
export function productMatchesSeriesTokens(
  product: {
    name?: string | null;
    slug?: string | null;
    modelNumber?: string | null;
    productSeries?: string | null;
  },
  tokens?: string[],
): boolean {
  if (!tokens || !tokens.length) return true;
  const haystack = [
    product.modelNumber,
    product.productSeries,
    product.name,
    product.slug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return tokens.some((token) => haystack.includes(token.toLowerCase()));
}
