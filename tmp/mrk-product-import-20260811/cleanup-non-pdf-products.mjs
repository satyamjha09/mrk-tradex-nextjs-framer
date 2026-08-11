const API_BASE = "https://www.mrktradex.com/api/v1";
const ADMIN_EMAIL = process.env.MRK_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.MRK_ADMIN_PASSWORD || "password123";

const keepModels = [
  "AHD24E",
  "AHD29A",
  "MHD16A",
  "MHD20D",
  "MRD16A-NEW",
  "MRD20D-NEW",
  "MRG16A",
  "MRG29A",
  "MRG29A AHD",
  "PRD16A-NEW",
  "PRD24AM",
  "DOL MRX01",
  "DOL MRXHD F04",
  "DOL MCP03H",
  "WLC PLUG SSO",
  "WLC PLUG TSO",
  "WLC PLUG WIFI",
  "CB12A",
  "CB16A",
  "CB25A",
  "CB40A",
  "CB MR 16A",
  "CB MR25A",
  "CB MR 40A",
  "DPM01",
  "DPM02",
  "DPM65 MM",
  "DPT01",
  "DPT02",
  "DPT03",
];

const shouldDelete = process.argv.includes("--delete");
let cookies = [];

function normalize(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function captureCookies(response) {
  const setCookie = response.headers.getSetCookie?.() || [];
  cookies.push(...setCookie.map((cookie) => cookie.split(";")[0]));
  cookies = [...new Map(cookies.map((cookie) => [cookie.split("=")[0], cookie])).values()];
}

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(cookies.length ? { cookie: cookies.join("; ") } : {}),
    },
  });
  captureCookies(response);
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`${response.status} ${url}: ${data.message || response.statusText}`);
  }
  return data;
}

async function main() {
  await request("/auth/sign-in", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const keepSet = new Set(keepModels.map(normalize));
  const productsData = await request("/products?limit=250");
  const products = productsData.products || productsData.data?.products || [];
  const extraProducts = products.filter((product) => {
    const model = normalize(product.modelNumber);
    const name = normalize(product.name);
    return !keepSet.has(model) && !keepSet.has(name);
  });

  console.log(`Found ${products.length} products.`);
  console.log(`Keeping ${products.length - extraProducts.length} PDF products.`);
  console.log(`${shouldDelete ? "Deleting" : "Would delete"} ${extraProducts.length} non-PDF products:`);
  extraProducts.forEach((product) => {
    console.log(`- ${product.modelNumber || product.name} (${product.slug})`);
  });

  if (!shouldDelete) {
    console.log("Dry run only. Re-run with --delete to remove these products.");
    return;
  }

  for (const product of extraProducts) {
    await request(`/products/${product.id}`, { method: "DELETE" });
    console.log(`deleted ${product.modelNumber || product.name}`);
  }

  const verifyData = await request("/products?limit=250");
  const remaining = verifyData.products || verifyData.data?.products || [];
  const remainingExtras = remaining.filter((product) => {
    const model = normalize(product.modelNumber);
    const name = normalize(product.name);
    return !keepSet.has(model) && !keepSet.has(name);
  });
  console.log(`After cleanup: ${remaining.length} products, ${remainingExtras.length} non-PDF products.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
