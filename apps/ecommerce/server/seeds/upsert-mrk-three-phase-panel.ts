import { PrismaClient } from "@prisma/client";

const images = [
  "/images/three-phase-panel.png",
  "/images/panel-components.png",
  "/images/intro-products.jpg",
  "/images/mrg-dpt-2-auto-timer.png",
];

export async function upsertMrkThreePhasePanel(prisma: PrismaClient) {
  const category = await prisma.category.upsert({
    where: { slug: "three-phase-panels" },
    update: {
      name: "Three Phase Panels",
      description: "Protection panels for higher HP pump and motor loads.",
      kind: "THREE_PHASE_PANEL",
      images: ["/images/three-phase-panel.png"],
      isVisible: true,
      sortOrder: 20,
    },
    create: {
      slug: "three-phase-panels",
      name: "Three Phase Panels",
      description: "Protection panels for higher HP pump and motor loads.",
      kind: "THREE_PHASE_PANEL",
      images: ["/images/three-phase-panel.png"],
      isVisible: true,
      sortOrder: 20,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: "mrk-three-phase-control-panel-admin-demo" },
    update: {
      name: "MRK Three Phase Control Panel Admin Demo",
      shortDescription:
        "Three phase motor control panel for agricultural and industrial pump loads.",
      description:
        "Demo MRK three phase technical listing for dealer and product enquiries.",
      modelNumber: "MRK-TP-CP-5HP-ADMIN",
      tagline: "Three phase motor protection panel",
      productLine: "Control Panel",
      productSeries: "Three Phase Panel",
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
      isActive: true,
      isPublished: true,
      isCatalogVisible: true,
      enquiryEnabled: true,
      sortOrder: 5,
      categoryId: category.id,
    },
    create: {
      slug: "mrk-three-phase-control-panel-admin-demo",
      name: "MRK Three Phase Control Panel Admin Demo",
      shortDescription:
        "Three phase motor control panel for agricultural and industrial pump loads.",
      description:
        "Demo MRK three phase technical listing for dealer and product enquiries.",
      modelNumber: "MRK-TP-CP-5HP-ADMIN",
      tagline: "Three phase motor protection panel",
      productLine: "Control Panel",
      productSeries: "Three Phase Panel",
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
      isActive: true,
      isPublished: true,
      isCatalogVisible: true,
      enquiryEnabled: true,
      sortOrder: 5,
      categoryId: category.id,
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: "MRK-TP-CP-5HP-ADMIN" },
    update: {
      productId: product.id,
      price: 6450,
      priceVisible: true,
      stock: 0,
      stockVisible: false,
      lowStockThreshold: 5,
      images,
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
      isActive: true,
      sortOrder: 0,
    },
    create: {
      productId: product.id,
      sku: "MRK-TP-CP-5HP-ADMIN",
      price: 6450,
      priceVisible: true,
      stock: 0,
      stockVisible: false,
      lowStockThreshold: 5,
      images,
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
      isActive: true,
      sortOrder: 0,
    },
  });

  console.log("MRK three phase control panel is published for all users.");
}

if (require.main === module) {
  const prisma = new PrismaClient();

  upsertMrkThreePhasePanel(prisma)
    .catch((error) => {
      console.error("Failed to upsert MRK three phase control panel:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
