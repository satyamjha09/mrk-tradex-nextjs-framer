import fs from "node:fs";
import path from "node:path";

const API_BASE = "https://www.mrktradex.com/api/v1";
const ADMIN_EMAIL = process.env.MRK_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.MRK_ADMIN_PASSWORD || "password123";
const ROOT = process.cwd();
const IMAGE_ROOT = path.join(ROOT, "tmp", "mrk-product-import-20260811");

const products = [
  { model: "AHD24E", series: "AHD SERIES", hp: "2HP", capacitor: "150/200, 50 MFD", mrp: 6720, group: "single", images: ["AHD24E_1.png", "AHD24E_2.png", "AHD24E_3.png"] },
  { model: "AHD29A", series: "AHD SERIES", hp: "3 HP", capacitor: "200/250, 50+50 MFD", mrp: 8290, group: "single", images: ["AHD29A_1.png", "AHD29A_2.png", "AHD29A_3.png", "AHD29A_4.png"] },
  { model: "MHD16A", series: "MHD SERIES", hp: "1 HP", capacitor: "100/120, 50 MFD", mrp: 3670, group: "single", images: ["ChatGPT Image Aug 10, 2026, 02_14_12 PM.png", "ChatGPT Image Aug 10, 2026, 02_14_19 PM.png"] },
  { model: "MHD20D", series: "MHD SERIES", hp: "1.5HP", capacitor: "120/150, 36+36", mrp: 4300, group: "single", images: ["ChatGPT Image Aug 10, 2026, 02_14_12 PM.png", "ChatGPT Image Aug 10, 2026, 02_14_19 PM.png"] },
  { model: "MRD16A-NEW", series: "MRD SERIES", hp: "1 HP", capacitor: "100/120, 50 MFD", mrp: 3350, group: "single", images: ["ChatGPT Image Aug 10, 2026, 02_14_12 PM.png", "ChatGPT Image Aug 10, 2026, 02_14_19 PM.png"] },
  { model: "MRD20D-NEW", series: "MRD SERIES", hp: "1.5 HP", capacitor: "120/150, 36+36", mrp: 3980, group: "single", images: ["ChatGPT Image Aug 10, 2026, 02_14_12 PM.png", "ChatGPT Image Aug 10, 2026, 02_14_19 PM.png"] },
  { model: "MRG16A", series: "MRG SERIES", hp: "1 HP", capacitor: "100/120, 50 MFD", mrp: 3550, group: "single", images: ["MRG16A (1).png", "MRG16A (2).png", "MRG16A (3).png", "MRG16A (4).png"] },
  { model: "MRG29A", series: "MRG SERIES", hp: "3 HP", capacitor: "200/250, 50+50", mrp: 6600, group: "single", images: ["MRG16A (1).png", "MRG16A (2).png", "MRG16A (3).png", "MRG16A (4).png"] },
  { model: "MRG29A AHD", series: "MRG SERIES", hp: "3 HP", capacitor: "200/250, 50+50", mrp: 8290, group: "single", images: ["MRG16A (1).png", "MRG16A (2).png", "MRG16A (3).png", "MRG16A (4).png"] },
  { model: "PRD16A-NEW", series: "PRD SERIES", hp: "1 HP", capacitor: "100/120, 50 MFD", mrp: 3150, group: "single", images: ["ChatGPT Image Aug 10, 2026, 02_14_12 PM.png", "ChatGPT Image Aug 10, 2026, 02_14_19 PM.png"] },
  { model: "PRD24AM", series: "PRD SERIES", hp: "2 HP", capacitor: "150/200, 36+36", mrp: 4750, group: "single", images: ["ChatGPT Image Aug 10, 2026, 02_14_12 PM.png", "ChatGPT Image Aug 10, 2026, 02_14_19 PM.png"] },

  { model: "DOL MRX01", series: "MRX SERIES", hp: "3HP", capacitor: "Relay: 06-Oct, Contactor: CB MR16", mrp: 4000, group: "three", images: ["DOL MRX-01.png", "DOL MRX-01 (2).png"] },
  { model: "DOL MRXHD F04", series: "MRX SERIES", hp: "3-7.5 HP", capacitor: "Relay: X, Contactor: CB MR40", mrp: 10000, group: "three", images: ["MRX-HD F04 (1).png", "MRX-HD F04 (2).png", "MRX-HD F04 (3).png"] },
  { model: "DOL MCP03H", series: "MCP SERIES", hp: "7.5 HP", capacitor: "Relay: 13-21, Contactor: CB MR25", mrp: 10000, group: "three", images: ["MRX-HD F04 (1).png", "MRX-HD F04 (2).png", "MRX-HD F04 (3).png"] },

  { model: "WLC PLUG SSO", series: "WLC SERIES", hp: "Not applicable", capacitor: "Sensor-wire smart plug range", mrp: 2000, group: "wlc", images: ["ChatGPT Image Aug 10, 2026, 02_11_03 PM.png"] },
  { model: "WLC PLUG TSO", series: "WLC SERIES", hp: "Not applicable", capacitor: "Tank sensor smart plug range", mrp: 2000, group: "wlc", images: ["ChatGPT Image Aug 10, 2026, 02_16_07 PM.png"] },
  { model: "WLC PLUG WIFI", series: "WLC SERIES", hp: "Not applicable", capacitor: "Wi-Fi smart plug range", mrp: 2000, group: "wlc", images: ["ChatGPT Image Aug 10, 2026, 02_11_03 PM.png", "ChatGPT Image Aug 10, 2026, 02_16_07 PM.png"] },

  { model: "CB12A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "12AMP, 220V", mrp: 600, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "CB16A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "16AMP, 220V", mrp: 600, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "CB25A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "25AMP, 220V", mrp: 800, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "CB40A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "40AMP, 220V", mrp: 400, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "CB MR 16A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "16AMP, 200-450V", mrp: 1500, group: "switch", images: ["DOL MRX-01 (2).png"] },
  { model: "CB MR25A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "25AMP, 200-450V", mrp: 2000, group: "switch", images: ["DOL MRX-01 (2).png"] },
  { model: "CB MR 40A", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "40AMP, 200-450V", mrp: 3000, group: "switch", images: ["DOL MRX-01 (2).png"] },
  { model: "DPM01", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "Switchgear meter range", mrp: 300, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "DPM02", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "Switchgear meter range", mrp: 400, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "DPM65 MM", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "Switchgear meter range", mrp: 250, group: "switch", images: ["DOL MRX-01.png"] },
  { model: "DPT01", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "Switchgear meter range", mrp: 500, group: "switch", images: ["DOL MRX-01 (2).png"] },
  { model: "DPT02", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "Switchgear meter range", mrp: 500, group: "switch", images: ["DOL MRX-01 (2).png"] },
  { model: "DPT03", series: "SWITCH GEARS", hp: "Not applicable", capacitor: "Switchgear meter range", mrp: 2000, group: "switch", images: ["DOL MRX-01 (2).png"] },
];

const groupMeta = {
  single: {
    categoryNames: ["Single Phase Starters"],
    productLine: "I-Phase Starter Panel",
    phase: "SINGLE_PHASE",
    description: (p) =>
      `MRK ${p.model} ${p.series} single phase starter for pump applications. HP: ${p.hp}. Capacitor range: ${p.capacitor}.`,
  },
  three: {
    categoryNames: ["Three Phase Panels"],
    productLine: "III-Phase Starter Panel",
    phase: "THREE_PHASE",
    description: (p) =>
      `MRK ${p.model} ${p.series} three phase starter panel for agricultural and industrial pump loads. HP range: ${p.hp}. ${p.capacitor}.`,
  },
  wlc: {
    categoryNames: ["Smart Controls", "WLC Smart Plug"],
    productLine: "WLC Smart Plug",
    phase: "NOT_APPLICABLE",
    description: (p) =>
      `MRK ${p.model} ${p.series} smart water level control plug for automatic pump switching and protection.`,
  },
  switch: {
    categoryNames: ["Cables & Accessories", "Switch Gears"],
    productLine: "Switch Gears",
    phase: "NOT_APPLICABLE",
    description: (p) =>
      `MRK ${p.model} switchgear component for starter panel servicing, dealer stocking, and replacement requirements. Range: ${p.capacitor}.`,
  },
};

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const skuFor = (model) =>
  `${model.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 42)}-MAIN`;

let cookies = [];

function captureCookies(response) {
  const setCookie = response.headers.getSetCookie?.() || [];
  cookies.push(...setCookie.map((cookie) => cookie.split(";")[0]));
  cookies = [...new Map(cookies.map((cookie) => [cookie.split("=")[0], cookie])).values()];
}

function cookieHeader() {
  return cookies.join("; ");
}

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(cookieHeader() ? { cookie: cookieHeader() } : {}),
    },
  });
  captureCookies(response);
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    const message = data?.message || data?.raw || response.statusText;
    throw new Error(`${response.status} ${url}: ${message}`);
  }
  return data;
}

function findImage(filename) {
  const compressed = path.join(
    IMAGE_ROOT,
    "compressed",
    `${path.parse(filename).name}.jpg`,
  );
  if (fs.existsSync(compressed)) return compressed;

  const stack = [IMAGE_ROOT];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile() && entry.name.toLowerCase() === filename.toLowerCase()) {
        return full;
      }
    }
  }
  throw new Error(`Image not found: ${filename}`);
}

async function appendImages(form, imageFiles) {
  const indexes = [];
  for (const filePath of imageFiles.slice(0, 4)) {
    const blob = await fs.openAsBlob(filePath, { type: "image/jpeg" });
    form.append("images", blob, path.basename(filePath));
    indexes.push(indexes.length);
  }
  form.append("variants[0][imageIndexes]", JSON.stringify(indexes));
}

function appendProductForm(form, product, categoryId, sortOrder) {
  const meta = groupMeta[product.group];
  form.append("name", product.model);
  form.append("description", meta.description(product));
  form.append("shortDescription", `${product.model} - ${product.hp} - ${product.capacitor}`);
  form.append("modelNumber", product.model);
  form.append("productLine", meta.productLine);
  form.append("productSeries", product.series);
  form.append("phase", meta.phase);
  form.append("hp", product.hp);
  form.append("capacitor", product.capacitor);
  form.append("seoTitle", `MRK ${product.model}`);
  form.append("seoDescription", meta.description(product));
  form.append("categoryId", categoryId);
  form.append("isNew", "true");
  form.append("isFeatured", product.group === "single" || product.group === "three" ? "true" : "false");
  form.append("isTrending", "false");
  form.append("isBestSeller", "false");
  form.append("isActive", "true");
  form.append("isPublished", "true");
  form.append("isCatalogVisible", "true");
  form.append("enquiryEnabled", "true");
  form.append("sortOrder", String(sortOrder));

  form.append("variants[0][sku]", skuFor(product.model));
  form.append("variants[0][price]", String(product.mrp));
  form.append("variants[0][stock]", "0");
  form.append("variants[0][lowStockThreshold]", "10");
  form.append("variants[0][priceVisible]", "true");
  form.append("variants[0][stockVisible]", "false");
  form.append("variants[0][isActive]", "true");
  form.append("variants[0][hp]", product.hp);
  form.append("variants[0][attributes]", "[]");
  form.append("variants[0][images]", "[]");
}

async function main() {
  await request("/auth/sign-in", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const categoriesData = await request("/categories");
  const categories = categoriesData.categories || categoriesData.data?.categories || [];
  const categoryByName = new Map(categories.map((category) => [category.name.toLowerCase(), category.id]));

  const productsData = await request("/products?limit=250");
  const existingProducts = productsData.products || productsData.data?.products || [];
  const existingBySlug = new Map(existingProducts.map((product) => [product.slug, product]));
  const existingByName = new Map(existingProducts.map((product) => [product.name.toLowerCase(), product]));

  const results = [];
  for (const [index, product] of products.entries()) {
    const meta = groupMeta[product.group];
    const categoryId = meta.categoryNames
      .map((name) => categoryByName.get(name.toLowerCase()))
      .find(Boolean);
    if (!categoryId) throw new Error(`Category not found for ${product.model}`);

    const imageFiles = product.images.map(findImage);
    const form = new FormData();
    appendProductForm(form, product, categoryId, (index + 1) * 10);
    await appendImages(form, imageFiles);

    const slug = slugify(product.model);
    const existing = existingBySlug.get(slug) || existingByName.get(product.model.toLowerCase());
    const method = existing ? "PUT" : "POST";
    const endpoint = existing ? `/products/${existing.id}` : "/products";
    await request(endpoint, { method, body: form });
    results.push(`${method === "PUT" ? "updated" : "created"} ${product.model}`);
    console.log(results.at(-1));
  }

  console.log(`Done. ${results.length} products processed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
