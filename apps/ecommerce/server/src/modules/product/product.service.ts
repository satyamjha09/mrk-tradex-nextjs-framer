import AppError from "@/shared/errors/AppError";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { ProductRepository } from "./product.repository";
import slugify from "@/shared/utils/slugify";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import prisma from "@/infra/database/database.config";
import { AttributeRepository } from "../attribute/attribute.repository";
import { VariantRepository } from "../variant/variant.repository";

const MAX_VARIANT_IMAGES = 4;

const productInclude = {
  category: true,
  variants: {
    include: {
      attributes: {
        include: {
          attribute: true,
          value: true,
        },
      },
    },
  },
} as const;

const buildVariantCreateData = (variant: any) => {
  return {
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,
    priceVisible: variant.priceVisible,
    stockVisible: variant.stockVisible,
    lowStockThreshold: variant.lowStockThreshold || 10,
    barcode: variant.barcode,
    warehouseLocation: variant.warehouseLocation,
    hp: variant.hp,
    hpMin: variant.hpMin,
    hpMax: variant.hpMax,
    phase: variant.phase,
    variantType: variant.variantType,
    maxLoadAmps: variant.maxLoadAmps,
    boxType: variant.boxType,
    bodyType: variant.bodyType,
    meterType: variant.meterType,
    meterDisplayType: variant.meterDisplayType,
    meterSize: variant.meterSize,
    startCapacitor: variant.startCapacitor,
    runCapacitor: variant.runCapacitor,
    mcbRelayOlp: variant.mcbRelayOlp,
    warranty: variant.warranty,
    protectionFeatures: variant.protectionFeatures,
    installationInfo: variant.installationInfo,
    manualUrl: variant.manualUrl,
    videoUrl: variant.videoUrl,
    isActive: variant.isActive,
    sortOrder: variant.sortOrder,
    images: variant.images || [],
    attributes: {
      create: (variant.attributes || []).map((attr: any) => ({
        attributeId: attr.attributeId,
        valueId: attr.valueId,
      })),
    },
  };
};

const normalizeVariantAttributes = (
  attributes: { attributeId?: string; valueId?: string }[] = [],
) =>
  attributes.filter(
    (attribute) => attribute?.attributeId && attribute?.valueId,
  ) as { attributeId: string; valueId: string }[];

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private attributeRepository: AttributeRepository,
    private variantRepository: VariantRepository,
  ) {}

  async getAllProducts(queryString: Record<string, any>) {
    const apiFeatures = new ApiFeatures(queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    const { where, orderBy, skip, take, select } = apiFeatures;

    const finalWhere = where && Object.keys(where).length > 0 ? where : {};

    const totalResults = await this.productRepository.countProducts({
      where: finalWhere,
    });

    const totalPages = Math.ceil(totalResults / take);
    const currentPage = Math.floor(skip / take) + 1;

    const products = await this.productRepository.findManyProducts({
      where: finalWhere,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
      select,
    });

    return {
      products,
      totalResults,
      totalPages,
      currentPage,
      resultsPerPage: take,
    };
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  async getProductBySlug(productSlug: string) {
    const product = await this.productRepository.findProductBySlug(productSlug);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    description?: string;
    shortDescription?: string;
    modelNumber?: string;
    tagline?: string;
    productLine?: string;
    productSeries?: string;
    phase?: "SINGLE_PHASE" | "THREE_PHASE" | "NOT_APPLICABLE";
    hp?: string;
    boxType?: string;
    meterType?: string;
    startCapacitor?: string;
    runCapacitor?: string;
    capacitor?: string;
    maxLoad?: string;
    mcbRelayOlp?: string;
    warranty?: string;
    voltage?: string;
    ampRating?: string;
    suitableFor?: string;
    protectionFeatures?: string[];
    useCases?: string[];
    manualUrl?: string;
    videoUrl?: string;
    featuredVideoUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    isActive?: boolean;
    isPublished?: boolean;
    isCatalogVisible?: boolean;
    enquiryEnabled?: boolean;
    sortOrder?: number;
    isNew?: boolean;
    isTrending?: boolean;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
    variants?: {
      sku: string;
      price: number;
      priceVisible?: boolean;
      images: string[];
      stock: number;
      stockVisible?: boolean;
      lowStockThreshold?: number;
      barcode?: string;
      warehouseLocation?: string;
      hp?: string;
      hpMin?: number;
      hpMax?: number;
      phase?: "SINGLE_PHASE" | "THREE_PHASE" | "NOT_APPLICABLE";
      variantType?: string;
      maxLoadAmps?: number;
      boxType?: string;
      bodyType?: string;
      meterType?: string;
      meterDisplayType?: "ANALOG" | "DIGITAL" | "NOT_APPLICABLE";
      meterSize?: string;
      startCapacitor?: string;
      runCapacitor?: string;
      mcbRelayOlp?: string;
      warranty?: string;
      protectionFeatures?: string[];
      installationInfo?: any;
      manualUrl?: string;
      videoUrl?: string;
      isActive?: boolean;
      sortOrder?: number;
      attributes: { attributeId: string; valueId: string }[];
    }[];
  }) {
    const { variants, ...productData } = data;

    if (!productData.name?.trim()) {
      throw new AppError(400, "Product name is required");
    }
    if (!productData.description?.trim()) {
      throw new AppError(400, "Product description is required");
    }
    if (!productData.hp?.trim()) {
      throw new AppError(400, "HP is required");
    }
    if (!productData.capacitor?.trim()) {
      throw new AppError(400, "Capacitor is required");
    }
    if (!variants || variants.length === 0) {
      throw new AppError(400, "At least one variant is required");
    }
    const sanitizedVariants = variants.map((variant) => ({
      ...variant,
      attributes: normalizeVariantAttributes(variant.attributes),
    }));

    // Validate SKU format (alphanumeric with dashes, 3-50 characters)
    const skuRegex = /^[a-zA-Z0-9-]+$/;
    sanitizedVariants.forEach((variant, index) => {
      if (
        !variant.sku ||
        !skuRegex.test(variant.sku) ||
        variant.sku.length < 3 ||
        variant.sku.length > 50
      ) {
        throw new AppError(
          400,
          `Variant at index ${index} has invalid SKU. Use alphanumeric characters and dashes, 3-50 characters.`,
        );
      }
      if (!Number.isFinite(variant.price) || variant.price <= 0) {
        throw new AppError(
          400,
          `Variant at index ${index} must have a positive price`,
        );
      }
      if (!Number.isInteger(variant.stock) || variant.stock < 0) {
        throw new AppError(
          400,
          `Variant at index ${index} must have non-negative stock`,
        );
      }
      if (
        variant.lowStockThreshold !== undefined &&
        (!Number.isInteger(variant.lowStockThreshold) ||
          variant.lowStockThreshold < 0)
      ) {
        throw new AppError(
          400,
          `Variant at index ${index} must have non-negative lowStockThreshold`,
        );
      }
      if ((variant.images || []).length > MAX_VARIANT_IMAGES) {
        throw new AppError(
          400,
          `Variant at index ${index} can have a maximum of ${MAX_VARIANT_IMAGES} images`,
        );
      }
      if ((variant.images || []).length === 0) {
        throw new AppError(
          400,
          `Variant at index ${index} must have at least one product image`,
        );
      }
    });

    // Validate category and required attributes
    let requiredAttributeIds: string[] = [];
    if (productData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId },
        include: {
          attributes: {
            where: { isRequired: true },
            select: { attributeId: true },
          },
        },
      });
      if (!category) {
        throw new AppError(404, "Category not found");
      }
      requiredAttributeIds = category.attributes.map(
        (attr) => attr.attributeId,
      );
    }

    // Validate attributes and values in one query
    const allAttributeIds = [
      ...new Set(
        sanitizedVariants.flatMap((v) =>
          v.attributes.map((a) => a.attributeId),
        ),
      ),
    ];
    const allValueIds = [
      ...new Set(
        sanitizedVariants.flatMap((v) => v.attributes.map((a) => a.valueId)),
      ),
    ];
    const [existingAttributes, existingValues] = await Promise.all([
      prisma.attribute.findMany({
        where: { id: { in: allAttributeIds } },
        select: { id: true },
      }),
      prisma.attributeValue.findMany({
        where: { id: { in: allValueIds } },
        select: { id: true, attributeId: true },
      }),
    ]);

    if (existingAttributes.length !== allAttributeIds.length) {
      throw new AppError(400, "One or more attribute IDs are invalid");
    }
    if (existingValues.length !== allValueIds.length) {
      throw new AppError(400, "One or more attribute value IDs are invalid");
    }

    // Validate attribute-value pairs
    sanitizedVariants.forEach((variant, index) => {
      variant.attributes.forEach((attr, attrIndex) => {
        const value = existingValues.find((v) => v.id === attr.valueId);
        if (!value || value.attributeId !== attr.attributeId) {
          throw new AppError(
            400,
            `Attribute value at variant index ${index}, attribute index ${attrIndex} does not belong to the specified attribute`,
          );
        }
      });
    });

    // Validate unique SKUs
    const existingSkus = await prisma.productVariant.findMany({
      where: { sku: { in: sanitizedVariants.map((v) => v.sku) } },
      select: { sku: true },
    });
    if (existingSkus.length > 0) {
      throw new AppError(
        400,
        `Duplicate SKUs detected: ${existingSkus.map((s) => s.sku).join(", ")}`,
      );
    }

    // Validate unique attribute combinations
    const comboKeys = sanitizedVariants
      .map((variant) =>
        variant.attributes
          .map((attr) => `${attr.attributeId}:${attr.valueId}`)
          .sort()
          .join("|"),
      )
      .filter(Boolean);
    if (new Set(comboKeys).size !== comboKeys.length) {
      throw new AppError(400, "Duplicate attribute combinations detected");
    }

    // Validate required attributes
    sanitizedVariants.forEach((variant, index) => {
      const variantAttributeIds = variant.attributes.map(
        (attr) => attr.attributeId,
      );
      const missingAttributes = requiredAttributeIds.filter(
        (id) => !variantAttributeIds.includes(id),
      );
      if (missingAttributes.length > 0) {
        throw new AppError(
          400,
          `Variant at index ${index} is missing required attributes: ${missingAttributes.join(
            ", ",
          )}`,
        );
      }
    });

    return prisma.product.create({
      data: {
        ...productData,
        slug: slugify(productData.name),
        variants: {
          create: sanitizedVariants.map((variant) =>
            buildVariantCreateData(variant),
          ),
        },
      },
      include: productInclude,
    });
  }

  async updateProduct(
    productId: string,
    updatedData: Partial<{
      name: string;
      description?: string;
      shortDescription?: string;
      modelNumber?: string;
      tagline?: string;
      productLine?: string;
      productSeries?: string;
      phase?: "SINGLE_PHASE" | "THREE_PHASE" | "NOT_APPLICABLE";
      hp?: string;
      boxType?: string;
      meterType?: string;
      startCapacitor?: string;
      runCapacitor?: string;
      capacitor?: string;
      maxLoad?: string;
      mcbRelayOlp?: string;
      warranty?: string;
      voltage?: string;
      ampRating?: string;
      suitableFor?: string;
      protectionFeatures?: string[];
      useCases?: string[];
      manualUrl?: string;
      videoUrl?: string;
      featuredVideoUrl?: string;
      seoTitle?: string;
      seoDescription?: string;
      isActive?: boolean;
      isPublished?: boolean;
      isCatalogVisible?: boolean;
      enquiryEnabled?: boolean;
      sortOrder?: number;
      basePrice: number;
      discount?: number;
      isNew?: boolean;
      isTrending?: boolean;
      isBestSeller?: boolean;
      isFeatured?: boolean;
      categoryId?: string;
      variants?: {
        sku: string;
        price: number;
        priceVisible?: boolean;
        images: string[];
        stock: number;
        stockVisible?: boolean;
        lowStockThreshold?: number;
        barcode?: string;
        warehouseLocation?: string;
        hp?: string;
        hpMin?: number;
        hpMax?: number;
        phase?: "SINGLE_PHASE" | "THREE_PHASE" | "NOT_APPLICABLE";
        variantType?: string;
        maxLoadAmps?: number;
        boxType?: string;
        bodyType?: string;
        meterType?: string;
        meterDisplayType?: "ANALOG" | "DIGITAL" | "NOT_APPLICABLE";
        meterSize?: string;
        startCapacitor?: string;
        runCapacitor?: string;
        mcbRelayOlp?: string;
        warranty?: string;
        protectionFeatures?: string[];
        installationInfo?: any;
        manualUrl?: string;
        videoUrl?: string;
        isActive?: boolean;
        sortOrder?: number;
        attributes: { attributeId: string; valueId: string }[];
      }[];
    }>,
  ) {
    const existingProduct =
      await this.productRepository.findProductById(productId);
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }

    const { variants, ...productData } = updatedData;

    if (
      productData.name !== undefined &&
      (typeof productData.name !== "string" || !productData.name.trim())
    ) {
      throw new AppError(400, "Product name is required");
    }
    if (
      productData.description !== undefined &&
      (typeof productData.description !== "string" ||
        !productData.description.trim())
    ) {
      throw new AppError(400, "Product description is required");
    }
    if (
      productData.categoryId !== undefined &&
      (typeof productData.categoryId !== "string" ||
        !productData.categoryId.trim())
    ) {
      throw new AppError(400, "Category is required");
    }

    let sanitizedVariants: typeof variants;

    // Validate variants if provided
    if (variants) {
      if (variants.length === 0) {
        throw new AppError(400, "At least one variant is required");
      }
      sanitizedVariants = variants.map((variant) => ({
        ...variant,
        attributes: normalizeVariantAttributes(variant.attributes),
      }));

      const skuRegex = /^[a-zA-Z0-9-]+$/;
      sanitizedVariants.forEach((variant, index) => {
        if (
          !variant.sku ||
          !skuRegex.test(variant.sku) ||
          variant.sku.length < 3 ||
          variant.sku.length > 50
        ) {
          throw new AppError(
            400,
            `Variant at index ${index} has an invalid SKU. Use alphanumeric characters and dashes, 3-50 characters.`,
          );
        }
        if (!Number.isFinite(variant.price) || variant.price <= 0) {
          throw new AppError(
            400,
            `Variant at index ${index} must have a positive price`,
          );
        }
        if (!Number.isInteger(variant.stock) || variant.stock < 0) {
          throw new AppError(
            400,
            `Variant at index ${index} must have a non-negative stock`,
          );
        }
        if (
          variant.lowStockThreshold !== undefined &&
          (!Number.isInteger(variant.lowStockThreshold) ||
            variant.lowStockThreshold < 0)
        ) {
          throw new AppError(
            400,
            `Variant at index ${index} must have a non-negative lowStockThreshold`,
          );
        }
      if ((variant.images || []).length > MAX_VARIANT_IMAGES) {
          throw new AppError(
            400,
            `Variant at index ${index} can have a maximum of ${MAX_VARIANT_IMAGES} images`,
          );
        }
        if ((variant.images || []).length === 0) {
          throw new AppError(
            400,
            `Variant at index ${index} must have at least one product image`,
          );
        }
      });

      const allAttributeIds = [
        ...new Set(
          sanitizedVariants.flatMap((v) =>
            v.attributes.map((a) => a.attributeId),
          ),
        ),
      ];
      const existingAttributes = await prisma.attribute.findMany({
        where: { id: { in: allAttributeIds } },
      });
      if (existingAttributes.length !== allAttributeIds.length) {
        throw new AppError(400, "One or more attributes are invalid");
      }

      const allValueIds = [
        ...new Set(
          sanitizedVariants.flatMap((v) =>
            v.attributes.map((a) => a.valueId),
          ),
        ),
      ];
      const existingValues = await prisma.attributeValue.findMany({
        where: { id: { in: allValueIds } },
      });
      if (existingValues.length !== allValueIds.length) {
        throw new AppError(400, "One or more attribute values are invalid");
      }

      const skuSet = new Set(sanitizedVariants.map((v) => v.sku));
      if (skuSet.size !== sanitizedVariants.length) {
        throw new AppError(400, "Duplicate SKUs detected");
      }

      const comboKeys = sanitizedVariants
        .map((variant) =>
          variant.attributes
            .map((attr) => `${attr.attributeId}:${attr.valueId}`)
            .sort()
            .join("|"),
        )
        .filter(Boolean);
      if (new Set(comboKeys).size !== comboKeys.length) {
        throw new AppError(400, "Duplicate attribute combinations detected");
      }

      const categoryId = productData.categoryId || existingProduct.categoryId;
      let requiredAttributeIds: string[] = [];
      if (categoryId) {
        const requiredAttributes = await prisma.categoryAttribute.findMany({
          where: { categoryId, isRequired: true },
          select: { attributeId: true },
        });
        requiredAttributeIds = requiredAttributes.map(
          (attr) => attr.attributeId,
        );
      }

      sanitizedVariants.forEach((variant, index) => {
        const variantAttributeIds = variant.attributes.map(
          (attr) => attr.attributeId,
        );
        const missingAttributes = requiredAttributeIds.filter(
          (id) => !variantAttributeIds.includes(id),
        );
        if (missingAttributes.length > 0) {
          throw new AppError(
            400,
            `Variant at index ${index} is missing required attributes: ${missingAttributes.join(
              ", ",
            )}`,
          );
        }
      });
    }

    return prisma.$transaction(
      async (tx) => {
        await tx.product.update({
          where: { id: productId },
          data: {
            ...productData,
            ...(productData.name && { slug: slugify(productData.name) }),
          },
        });

        if (sanitizedVariants) {
          await tx.productVariant.deleteMany({ where: { productId } });
          for (const variant of sanitizedVariants) {
            await tx.productVariant.create({
              data: {
                ...buildVariantCreateData(variant),
                product: { connect: { id: productId } },
              },
            });
          }
        }

        return tx.product.findUnique({
          where: { id: productId },
          include: productInclude,
        });
      },
      { timeout: 20000 },
    );
  }

  async bulkCreateProducts(file: Express.Multer.File) {
    if (!file) {
      throw new AppError(400, "No file uploaded");
    }

    let records: any[];
    try {
      if (file.mimetype === "text/csv") {
        records = parse(file.buffer.toString(), {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        records = XLSX.utils.sheet_to_json(sheet);
      } else {
        throw new AppError(400, "Unsupported file format. Use CSV or XLSX");
      }
    } catch (error) {
      throw new AppError(400, "Failed to parse file");
    }

    if (records.length === 0) {
      throw new AppError(400, "File is empty");
    }

    const products = records.map((record) => {
      if (!record.name || !record.basePrice) {
        throw new AppError(400, `Invalid record: ${JSON.stringify(record)}`);
      }

      return {
        name: String(record.name),
        slug: slugify(record.name),
        description: record.description
          ? String(record.description)
          : undefined,
        basePrice: Number(record.basePrice),
        discount: record.discount ? Number(record.discount) : 0,
        isNew: record.isNew ? Boolean(record.isNew) : false,
        isTrending: record.isTrending ? Boolean(record.isTrending) : false,
        isBestSeller: record.isBestSeller
          ? Boolean(record.isBestSeller)
          : false,
        isFeatured: record.isFeatured ? Boolean(record.isFeatured) : false,
        categoryId: record.categoryId ? String(record.categoryId) : undefined,
      };
    });

    const categoryIds = products
      .filter((p) => p.categoryId)
      .map((p) => p.categoryId!);
    if (categoryIds.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true },
      });
      const validCategoryIds = new Set(existingCategories.map((c) => c.id));
      for (const product of products) {
        if (product.categoryId && !validCategoryIds.has(product.categoryId)) {
          throw new AppError(400, `Invalid categoryId: ${product.categoryId}`);
        }
      }
    }

    await this.productRepository.createManyProducts(products);

    return { count: products.length };
  }

  async deleteProduct(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    await this.productRepository.deleteProduct(productId);
  }
}
