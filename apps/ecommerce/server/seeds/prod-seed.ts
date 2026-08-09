import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { upsertMrkThreePhasePanel } from "./upsert-mrk-three-phase-panel";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "single-phase-starters",
    name: "Single Phase Starters",
    description: "Pump starter panels for domestic and agricultural motors.",
    kind: "SINGLE_PHASE_STARTER",
    sortOrder: 10,
    images: ["/images/single-phase-starter.png"],
  },
  {
    slug: "three-phase-panels",
    name: "Three Phase Panels",
    description: "Protection panels for higher HP pump and motor loads.",
    kind: "THREE_PHASE_PANEL",
    sortOrder: 20,
    images: ["/images/three-phase-panel.png"],
  },
  {
    slug: "smart-controls",
    name: "Smart Controls",
    description: "WLC smart plugs, relays, and water level control products.",
    kind: "WLC_SMART_PLUG",
    sortOrder: 30,
    images: ["/images/MRK WEBSITE/WLC Smart Plug/DOC-20260802-WA0063_.jpg"],
  },
  {
    slug: "cables-accessories",
    name: "Cables & Accessories",
    description: "Cables, capacitors, switches, relays, and panel accessories.",
    kind: "CABLE_ACCESSORY",
    sortOrder: 40,
    images: ["/images/panel-components.png"],
  },
] as const;

const attributes = [
  {
    name: "Phase",
    slug: "phase",
    values: ["Single Phase", "Three Phase", "Not Applicable"],
  },
  {
    name: "HP Range",
    slug: "hp-range",
    values: ["0.5-1.5 HP", "1-2 HP", "3-5 HP", "7.5 HP", "Model Based"],
  },
  {
    name: "Product Type",
    slug: "product-type",
    values: ["Auto Timer Starter", "Smart Plug", "Digital Panel", "Accessory Kit"],
  },
] as const;

const users = [
  { email: "superadmin@example.com", name: "MRK Super Admin", role: "SUPERADMIN" },
  { email: "admin@example.com", name: "MRK Admin", role: "ADMIN" },
  { email: "user@example.com", name: "MRK Customer", role: "USER" },
] as const;

const slugifyValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function seedUsers() {
  const password = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "password123", 12);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
      },
      create: {
        email: user.email,
        password,
        name: user.name,
        role: user.role,
      },
    });
  }
}

async function seedCategories() {
  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        kind: category.kind,
        images: [...category.images],
        isVisible: true,
        sortOrder: category.sortOrder,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        kind: category.kind,
        images: [...category.images],
        isVisible: true,
        sortOrder: category.sortOrder,
      },
    });

    categoryIds.set(category.slug, record.id);
  }

  return categoryIds;
}

async function seedAttributes(categoryIds: Map<string, string>) {
  for (const attribute of attributes) {
    const attr = await prisma.attribute.upsert({
      where: { slug: attribute.slug },
      update: { name: attribute.name },
      create: {
        name: attribute.name,
        slug: attribute.slug,
      },
    });

    for (const value of attribute.values) {
      const valueSlug = `${attribute.slug}-${slugifyValue(value)}`;
      await prisma.attributeValue.upsert({
        where: { slug: valueSlug },
        update: {
          attributeId: attr.id,
          value,
        },
        create: {
          attributeId: attr.id,
          value,
          slug: valueSlug,
        },
      });
    }

    for (const categoryId of categoryIds.values()) {
      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId,
            attributeId: attr.id,
          },
        },
        update: { isRequired: false },
        create: {
          categoryId,
          attributeId: attr.id,
          isRequired: false,
        },
      });
    }
  }
}

async function main() {
  console.log("Starting production-safe MRK seed...");

  await seedUsers();
  const categoryIds = await seedCategories();
  await seedAttributes(categoryIds);
  await upsertMrkThreePhasePanel(prisma);

  console.log("Production-safe MRK seed completed.");
  console.log(`Users upserted: ${users.length}`);
  console.log(`Categories upserted: ${categoryIds.size}`);
  console.log("Starter product upserted: mrk-three-phase-control-panel-admin-demo");
}

main()
  .catch((error) => {
    console.error("Production-safe MRK seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
