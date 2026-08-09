import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const heroImage = "/images/mrg-dpt-2-auto-timer.png";

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
];

const products: any[] = [
  {
    categorySlug: "single-phase-starters",
    slug: "mrg-auto-timer-starter",
    name: "MRG Auto-Timer Starter",
    shortDescription: "Starter with built-in auto-off timer for overhead tank protection.",
    description:
      "Set how long you want the pump to run, and the starter switches it off automatically when the time is over.",
    productSeries: "MRG Series",
    productLine: "Auto Timer",
    modelNumber: "MRG",
    tagline: "Starter with Built-in Auto-Off Timer",
    phase: "SINGLE_PHASE",
    hp: "0.5-2 HP",
    boxType: "Powder coated metal box",
    meterType: "Digital timer display",
    warranty: "12 months",
    voltage: "220V AC",
    protectionFeatures: ["Auto-off timer", "Overload protection", "No separate WLC required"],
    useCases: ["Overhead tank filling", "Domestic pump", "Small farm motor"],
    isNew: true,
    isFeatured: true,
    isTrending: true,
    sortOrder: 10,
    images: ["/images/mrg-dpt-2-auto-timer.png", "/images/MRK WEBSITE/SLider MRG Auto Timer/21.png"],
    variants: [
      {
        sku: "MRK-MRG-1HP-AUTO",
        price: 2450,
        stock: 25,
        hp: "1 HP",
        hpMin: 1,
        hpMax: 1,
        phase: "SINGLE_PHASE",
        variantType: "Auto timer starter",
        maxLoadAmps: 10,
      },
      {
        sku: "MRK-MRG-2HP-AUTO",
        price: 3150,
        stock: 18,
        hp: "2 HP",
        hpMin: 2,
        hpMax: 2,
        phase: "SINGLE_PHASE",
        variantType: "Auto timer starter",
        maxLoadAmps: 16,
      },
    ],
  },
  {
    categorySlug: "smart-controls",
    slug: "wlc-smart-plug",
    name: "WLC Smart Plug",
    shortDescription: "Smart water-level control for Tullu and submersible pumps.",
    description:
      "Connect your pump through the smart plug. Its tank sensor detects water level and automatically controls pump on/off.",
    productSeries: "WLC Smart Plug",
    productLine: "Smart Water Control",
    modelNumber: "WLC",
    tagline: "Smart Water-Level Control for Your Pump",
    phase: "SINGLE_PHASE",
    hp: "Up to 1.5 HP",
    boxType: "Plug-in body",
    meterType: "LED level display",
    warranty: "12 months",
    voltage: "220V AC",
    protectionFeatures: ["Automatic pump ON/OFF", "Tank overflow prevention", "LED water level display"],
    useCases: ["Tullu pump", "Submersible pump", "Overhead tank"],
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    sortOrder: 20,
    images: ["/images/MRK WEBSITE/WLC Smart Plug/DOC-20260802-WA0063_.jpg"],
    variants: [
      {
        sku: "MRK-WLC-SMART-PLUG",
        price: 2250,
        stock: 30,
        hp: "Up to 1.5 HP",
        hpMin: 0.5,
        hpMax: 1.5,
        phase: "SINGLE_PHASE",
        variantType: "Smart water level plug",
        maxLoadAmps: 8,
      },
    ],
  },
  {
    categorySlug: "three-phase-panels",
    slug: "mrk-three-phase-control-panel-admin-demo",
    name: "MRK Three Phase Control Panel Admin Demo",
    shortDescription: "Three phase motor control panel for agricultural and industrial pump loads.",
    description:
      "Demo MRK three phase technical listing for dealer and product enquiries.",
    productSeries: "Three Phase Panel",
    productLine: "Control Panel",
    modelNumber: "MRK-TP-CP-5HP-ADMIN",
    tagline: "Three phase motor protection panel",
    phase: "THREE_PHASE",
    hp: "5 HP",
    maxLoad: "15 A",
    boxType: "Powder coated metal enclosure",
    meterType: "Digital",
    mcbRelayOlp: "MCB + relay + OLP",
    warranty: "12 months",
    voltage: "415 V",
    ampRating: "15 A",
    suitableFor: "Agriculture pump",
    protectionFeatures: ["Single phasing", "Overload", "Voltage guard"],
    useCases: ["Agriculture pump", "Industrial water transfer"],
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    sortOrder: 5,
    images: [
      "/images/three-phase-panel.png",
      "/images/panel-components.png",
      "/images/intro-products.jpg",
      "/images/mrg-dpt-2-auto-timer.png",
    ],
    variants: [
      {
        sku: "MRK-TP-CP-5HP-ADMIN",
        price: 6450,
        stock: 0,
        hp: "5 HP",
        hpMin: 5,
        hpMax: 5,
        phase: "THREE_PHASE",
        variantType: "Control panel",
        maxLoadAmps: 15,
        boxType: "Powder coated metal enclosure",
        bodyType: "Powder coated metal enclosure",
        meterType: "Digital",
        meterDisplayType: "DIGITAL",
        meterSize: "96 x 96 mm",
        mcbRelayOlp: "MCB + relay + OLP",
        warranty: "12 months",
        protectionFeatures: ["Single phasing", "Overload", "Voltage guard"],
      },
    ],
  },
  {
    categorySlug: "three-phase-panels",
    slug: "mrx-hd-three-phase-digital-starter-panel",
    name: "MRX-HD Three-Phase Digital Starter Panel",
    shortDescription: "Fully digital starter panel for agriculture, industry, and housing.",
    description:
      "A fully digital starter panel designed to monitor voltage/current load and protect three-phase pumps automatically.",
    productSeries: "MRX-HD",
    productLine: "Three Phase Digital Panel",
    modelNumber: "MRX-HD",
    tagline: "Smarter Protection for III-Phase Pumps",
    phase: "THREE_PHASE",
    hp: "3-10 HP",
    boxType: "Heavy duty metal enclosure",
    meterType: "Digital voltage/current display",
    warranty: "12 months",
    voltage: "415V AC",
    protectionFeatures: ["Phase failure protection", "Voltage fluctuation protection", "Error code display"],
    useCases: ["Agriculture pump", "Industrial water transfer", "Housing pump room"],
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    sortOrder: 30,
    images: ["/images/three-phase-panel.png", "/images/MRK WEBSITE/Slider MRX HD/DOC-20260802-WA0062_.jpg"],
    variants: [
      {
        sku: "MRK-MRXHD-5HP-DIGITAL",
        price: 6450,
        stock: 15,
        hp: "5 HP",
        hpMin: 5,
        hpMax: 5,
        phase: "THREE_PHASE",
        variantType: "Digital starter panel",
        maxLoadAmps: 15,
      },
      {
        sku: "MRK-MRXHD-7-5HP-DIGITAL",
        price: 7850,
        stock: 10,
        hp: "7.5 HP",
        hpMin: 7.5,
        hpMax: 7.5,
        phase: "THREE_PHASE",
        variantType: "Digital starter panel",
        maxLoadAmps: 22,
      },
    ],
  },
  {
    categorySlug: "cables-accessories",
    slug: "mrk-panel-accessory-kit",
    name: "MRK Panel Accessory Kit",
    shortDescription: "Matched accessories for starter panel service and dealer stock.",
    description:
      "Capacitor, relay, and switchgear accessories for service, replacement, and dealer enquiry workflows.",
    productSeries: "Accessories",
    productLine: "Service Parts",
    modelNumber: "MRK-ACCESSORY-KIT",
    hp: "Model based",
    warranty: "6 months",
    protectionFeatures: ["Matched starter spares", "Dealer service support"],
    useCases: ["Starter repair", "Dealer service stock", "Panel maintenance"],
    isFeatured: true,
    sortOrder: 40,
    images: ["/images/panel-components.png"],
    variants: [
      {
        sku: "MRK-CAP-RELAY-KIT",
        price: 780,
        stock: 40,
        variantType: "Accessory kit",
      },
    ],
  },
];

async function cleanup() {
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.report.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.cartEvent.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.address.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.restock.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.productVariantAttribute.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.categoryAttribute.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const password = await bcrypt.hash("password123", 12);

  await prisma.user.createMany({
    data: [
      { email: "superadmin@example.com", password, name: "MRK Super Admin", role: "SUPERADMIN" },
      { email: "admin@example.com", password, name: "MRK Admin", role: "ADMIN" },
      { email: "user@example.com", password, name: "MRK Customer", role: "USER" },
    ],
    skipDuplicates: true,
  });
}

async function seedCategories() {
  const created = new Map<string, string>();

  for (const category of categories) {
    const item = await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        kind: category.kind as any,
        images: category.images,
        isVisible: true,
        sortOrder: category.sortOrder,
      },
    });
    created.set(category.slug, item.id);
  }

  return created;
}

async function seedAttributes(categoryIds: Map<string, string>) {
  const attributes = [
    { name: "Phase", slug: "phase", values: ["Single Phase", "Three Phase", "Not Applicable"] },
    { name: "HP Range", slug: "hp-range", values: ["0.5-1.5 HP", "1-2 HP", "3-5 HP", "7.5 HP", "Model Based"] },
    { name: "Product Type", slug: "product-type", values: ["Auto Timer Starter", "Smart Plug", "Digital Panel", "Accessory Kit"] },
  ];

  const created = new Map<string, { attributeId: string; valueIds: Map<string, string> }>();

  for (const attribute of attributes) {
    const attr = await prisma.attribute.create({
      data: { name: attribute.name, slug: attribute.slug },
    });
    const valueIds = new Map<string, string>();

    for (const value of attribute.values) {
      const record = await prisma.attributeValue.create({
        data: {
          attributeId: attr.id,
          value,
          slug: `${attribute.slug}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        },
      });
      valueIds.set(value, record.id);
    }

    created.set(attribute.slug, { attributeId: attr.id, valueIds });

    for (const categoryId of categoryIds.values()) {
      await prisma.categoryAttribute.create({
        data: {
          categoryId,
          attributeId: attr.id,
          isRequired: false,
        },
      });
    }
  }

  return created;
}

async function seedProducts(categoryIds: Map<string, string>, attributes: Awaited<ReturnType<typeof seedAttributes>>) {
  let createdProductCount = 0;
  let createdVariantCount = 0;

  for (const item of products) {
    const productImage = item.images[0] || heroImage;
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        shortDescription: item.shortDescription,
        modelNumber: item.modelNumber,
        tagline: item.tagline,
        productLine: item.productLine,
        productSeries: item.productSeries,
        phase: item.phase as any,
        hp: item.hp,
        boxType: item.boxType,
        meterType: item.meterType,
        startCapacitor: item.startCapacitor,
        runCapacitor: item.runCapacitor,
        capacitor: item.capacitor,
        maxLoad: item.maxLoad,
        mcbRelayOlp: item.mcbRelayOlp,
        warranty: item.warranty,
        voltage: item.voltage,
        ampRating: item.ampRating,
        suitableFor: item.suitableFor,
        protectionFeatures: item.protectionFeatures,
        useCases: item.useCases,
        isNew: Boolean(item.isNew),
        isFeatured: Boolean(item.isFeatured),
        isTrending: Boolean(item.isTrending),
        isBestSeller: Boolean(item.isBestSeller),
        isActive: true,
        isPublished: true,
        isCatalogVisible: true,
        enquiryEnabled: true,
        sortOrder: item.sortOrder,
        categoryId: categoryIds.get(item.categorySlug),
      },
    });
    createdProductCount += 1;

    for (const [index, variant] of item.variants.entries()) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          images: item.images.length ? item.images : [productImage],
          lowStockThreshold: 5,
          hp: variant.hp,
          hpMin: variant.hpMin,
          hpMax: variant.hpMax,
          phase: variant.phase as any,
          variantType: variant.variantType,
          maxLoadAmps: variant.maxLoadAmps,
          boxType: variant.boxType,
          bodyType: variant.bodyType,
          meterType: variant.meterType,
          meterDisplayType: variant.meterDisplayType as any,
          meterSize: variant.meterSize,
          startCapacitor: variant.startCapacitor,
          runCapacitor: variant.runCapacitor,
          mcbRelayOlp: variant.mcbRelayOlp,
          warranty: variant.warranty || item.warranty,
          protectionFeatures: variant.protectionFeatures || item.protectionFeatures,
          sortOrder: index,
          isActive: true,
        },
      });
      createdVariantCount += 1;

      const phase = attributes.get("phase");
      const productType = attributes.get("product-type");

      if (phase && variant.phase) {
        const label = variant.phase === "THREE_PHASE" ? "Three Phase" : "Single Phase";
        const valueId = phase.valueIds.get(label);
        if (valueId) {
          await prisma.productVariantAttribute.create({
            data: { variantId: createdVariant.id, attributeId: phase.attributeId, valueId },
          });
        }
      }

      if (productType && variant.variantType) {
        const normalizedType =
          variant.variantType.includes("plug")
            ? "Smart Plug"
            : variant.variantType.includes("panel")
              ? "Digital Panel"
              : variant.variantType.includes("Accessory")
                ? "Accessory Kit"
                : "Auto Timer Starter";
        const valueId = productType.valueIds.get(normalizedType);
        if (valueId) {
          await prisma.productVariantAttribute.create({
            data: { variantId: createdVariant.id, attributeId: productType.attributeId, valueId },
          });
        }
      }
    }
  }

  return { createdProductCount, createdVariantCount };
}

async function main() {
  console.log("Starting MRK database seed...");
  await cleanup();
  await seedUsers();
  const categoryIds = await seedCategories();
  const attributes = await seedAttributes(categoryIds);
  const counts = await seedProducts(categoryIds, attributes);

  console.log("MRK database seeded successfully.");
  console.log(`Users: 3`);
  console.log(`Categories: ${categoryIds.size}`);
  console.log(`Products: ${counts.createdProductCount}`);
  console.log(`Variants: ${counts.createdVariantCount}`);
  console.log("Demo logins: superadmin@example.com / admin@example.com / user@example.com");
  console.log("Password for all demo accounts: password123");
}

main()
  .catch((error) => {
    console.error("Error seeding MRK database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
