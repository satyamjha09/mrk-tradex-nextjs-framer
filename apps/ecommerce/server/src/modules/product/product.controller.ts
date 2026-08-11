import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ProductService } from "./product.service";
import slugify from "@/shared/utils/slugify";
import { makeLogsService } from "../logs/logs.factory";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";
import AppError from "@/shared/errors/AppError";

const productTextFields = [
  "shortDescription",
  "modelNumber",
  "tagline",
  "productLine",
  "productSeries",
  "hp",
  "boxType",
  "meterType",
  "startCapacitor",
  "runCapacitor",
  "capacitor",
  "maxLoad",
  "mcbRelayOlp",
  "warranty",
  "voltage",
  "ampRating",
  "suitableFor",
  "manualUrl",
  "videoUrl",
  "featuredVideoUrl",
  "seoTitle",
  "seoDescription",
] as const;

const productBooleanFields = [
  "isActive",
  "isPublished",
  "isCatalogVisible",
  "enquiryEnabled",
] as const;

const variantTextFields = [
  "hp",
  "variantType",
  "boxType",
  "bodyType",
  "meterType",
  "meterSize",
  "startCapacitor",
  "runCapacitor",
  "mcbRelayOlp",
  "warranty",
  "manualUrl",
  "videoUrl",
] as const;

const MAX_VARIANT_IMAGES = 4;
const SKU_REGEX = /^[a-zA-Z0-9-]{3,50}$/;

const parseBoolean = (value: unknown) =>
  value === true || value === "true" || value === "1";

const buildGeneratedSku = (productName: string, index: number) => {
  const base = slugify(productName)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 36);
  return `${base || "MRK-PRODUCT"}-${index + 1}-${Date.now().toString(36).toUpperCase()}`;
};

const parseOptionalNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseStringArray = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return undefined;
};

const parseJsonTextField = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return { text: value };
  }
};

const parseVariantsFromBody = (body: Record<string, any>) => {
  if (Array.isArray(body.variants)) return body.variants;
  if (typeof body.variants === "string") {
    try {
      const parsed = JSON.parse(body.variants);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      throw new AppError(400, "Invalid variants format");
    }
  }

  const parsedVariants: any[] = [];
  for (const key in body) {
    if (key.startsWith("variants[")) {
      const match = key.match(/^variants\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (!parsedVariants[index]) {
          parsedVariants[index] = {};
        }
        parsedVariants[index][field] = body[key];
      }
    }
  }
  return parsedVariants.filter(Boolean);
};

const requireText = (
  value: unknown,
  fieldLabel: string,
  options: { required?: boolean } = { required: true },
) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!options.required && (value === undefined || value === null || value === "")) {
    return undefined;
  }
  throw new AppError(400, `${fieldLabel} is required`);
};

const validateProductPayload = (
  body: Record<string, any>,
  options: { requireAll: boolean },
) => {
  if (options.requireAll || body.name !== undefined) {
    requireText(body.name, "Product name");
  }
  if (options.requireAll || body.description !== undefined) {
    requireText(body.description, "Product description");
  }
  if (options.requireAll || body.hp !== undefined) {
    requireText(body.hp, "HP");
  }
  if (options.requireAll || body.capacitor !== undefined) {
    requireText(body.capacitor, "Capacitor");
  }
};

const parseJsonArrayField = (
  value: unknown,
  fieldLabel: string,
  defaultValue: any[] = [],
) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      throw new AppError(400, `Invalid ${fieldLabel} format`);
    }
  }
  throw new AppError(400, `${fieldLabel} must be an array`);
};

const parsePrice = (value: unknown, index: number) => {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) {
    throw new AppError(
      400,
      `Variant at index ${index} must have a valid positive price`,
    );
  }
  return price;
};

const parseStock = (value: unknown, index: number) => {
  if (value === undefined || value === null || value === "") return 0;
  const stock = Number(value);
  if (!Number.isInteger(stock) || stock < 0) {
    throw new AppError(
      400,
      `Variant at index ${index} must have a valid non-negative stock number`,
    );
  }
  return stock;
};

const parseLowStockThreshold = (value: unknown, index: number) => {
  if (value === undefined || value === null || value === "") return 10;
  const lowStockThreshold = Number(value);
  if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
    throw new AppError(
      400,
      `Variant at index ${index} must have a valid non-negative low stock threshold`,
    );
  }
  return lowStockThreshold;
};

const validateSku = (sku: unknown, index: number) => {
  if (typeof sku !== "string" || !SKU_REGEX.test(sku.trim())) {
    throw new AppError(
      400,
      `Variant at index ${index} has invalid SKU. Use alphanumeric characters and dashes, 3-50 characters.`,
    );
  }
  return sku.trim();
};

const resolveSku = (sku: unknown, productName: string, index: number) => {
  if (typeof sku === "string" && sku.trim()) return validateSku(sku, index);
  return validateSku(buildGeneratedSku(productName, index), index);
};

const validateVariantImageCount = (count: number, index: number) => {
  if (count > MAX_VARIANT_IMAGES) {
    throw new AppError(
      400,
      `Variant at index ${index} can have a maximum of ${MAX_VARIANT_IMAGES} images`,
    );
  }
};

const parseImageIndexes = (variant: Record<string, any>, index: number) => {
  const imageIndexes = parseJsonArrayField(
    variant.imageIndexes,
    `image indexes at variant index ${index}`,
  );
  imageIndexes.forEach((idx) => {
    if (!Number.isInteger(idx) || idx < 0) {
      throw new AppError(
        400,
        `Invalid image index at variant index ${index}`,
      );
    }
  });
  validateVariantImageCount(imageIndexes.length, index);
  return imageIndexes as number[];
};

const getUploadedImageUrls = (
  imageIndexes: number[],
  imageResults: { url: string; public_id: string }[],
  index: number,
) =>
  imageIndexes.map((idx) => {
    const result = imageResults[idx];
    if (!result?.url) {
      throw new AppError(
        400,
        `Invalid uploaded image reference at variant index ${index}`,
      );
    }
    return result.url;
  });

const getVariantFilesFromImageIndexes = (
  variant: Record<string, any>,
  files: Express.Multer.File[],
  index: number,
) => {
  if (variant.imageIndexes === undefined) {
    const legacyFiles = files.filter((file) =>
      file.fieldname.startsWith(`variants[${index}][images][`),
    );
    validateVariantImageCount(legacyFiles.length, index);
    return legacyFiles;
  }

  const imageIndexes = parseImageIndexes(variant, index);
  return imageIndexes.map((idx) => {
    const file = files.find(
      (candidate) =>
        candidate.fieldname === "images" && files.indexOf(candidate) === idx,
    );
    if (!file) {
      throw new AppError(
        400,
        `Invalid uploaded image reference at variant index ${index}`,
      );
    }
    return file;
  });
};

const parseProductMrkFields = (body: Record<string, any>) => {
  const data: Record<string, any> = {};
  productTextFields.forEach((field) => {
    if (body[field]) data[field] = body[field];
  });
  productBooleanFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = parseBoolean(body[field]);
  });
  if (body.phase) data.phase = body.phase;
  const sortOrder = parseOptionalNumber(body.sortOrder);
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  const protectionFeatures = parseStringArray(body.protectionFeatures);
  if (protectionFeatures) data.protectionFeatures = protectionFeatures;
  const useCases = parseStringArray(body.useCases);
  if (useCases) data.useCases = useCases;
  return data;
};

const parseVariantMrkFields = (variant: Record<string, any>) => {
  const data: Record<string, any> = {};
  variantTextFields.forEach((field) => {
    if (variant[field]) data[field] = variant[field];
  });
  ["priceVisible", "stockVisible", "isActive"].forEach((field) => {
    if (variant[field] !== undefined)
      data[field] = parseBoolean(variant[field]);
  });
  ["hpMin", "hpMax", "maxLoadAmps", "sortOrder"].forEach((field) => {
    const parsed = parseOptionalNumber(variant[field]);
    if (parsed !== undefined) data[field] = parsed;
  });
  if (variant.phase) data.phase = variant.phase;
  if (variant.meterDisplayType)
    data.meterDisplayType = variant.meterDisplayType;
  const protectionFeatures = parseStringArray(variant.protectionFeatures);
  if (protectionFeatures) data.protectionFeatures = protectionFeatures;
  const installationInfo = parseJsonTextField(variant.installationInfo);
  if (installationInfo) data.installationInfo = installationInfo;
  return data;
};

export class ProductController {
  private logsService = makeLogsService();
  constructor(private productService: ProductService) {}

  getAllProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        products,
        totalResults,
        totalPages,
        currentPage,
        resultsPerPage,
      } = await this.productService.getAllProducts(req.query);
      sendResponse(res, 200, {
        data: {
          products,
          totalResults,
          totalPages,
          currentPage,
          resultsPerPage,
        },
        message: "Products fetched successfully",
      });
    },
  );

  getProductById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const product = await this.productService.getProductById(productId);
      sendResponse(res, 200, {
        data: product,
        message: "Product fetched successfully",
      });
    },
  );

  getProductBySlug = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { slug: productSlug } = req.params;
      const product = await this.productService.getProductBySlug(productSlug);
      sendResponse(res, 200, {
        data: product,
        message: "Product fetched successfully",
      });
    },
  );

  createProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        name,
        description,
        isNew,
        isTrending,
        isBestSeller,
        isFeatured,
        categoryId,
      } = req.body;
      const mrkProductFields = parseProductMrkFields(req.body);

      // Log for debugging
      console.log(
        "req.body:",
        JSON.stringify(req.body, null, 2),
        "req.files:",
        req.files,
      );

      // Validate variants
      validateProductPayload(req.body, { requireAll: true });
      const variants = parseVariantsFromBody(req.body);
      if (!Array.isArray(variants) || variants.length === 0) {
        throw new AppError(400, "At least one variant is required");
      }

      // Upload images to Cloudinary
      const files = (req.files as Express.Multer.File[]) || [];
      let imageResults: { url: string; public_id: string }[] = [];
      if (files.length > 0) {
        try {
          imageResults = await uploadToCloudinary(files);
          if (imageResults.length !== files.length) {
            throw new AppError(400, "Failed to upload images to Cloudinary");
          }
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          throw new AppError(400, "Failed to upload images to Cloudinary");
        }
      }

      // Process variants
      const processedVariants = variants.map((variant: any, index: number) => {
        // Parse JSON fields
        let attributes = [];
        let imageIndexes = [];
        try {
          attributes = parseJsonArrayField(
            variant.attributes,
            `attributes at variant index ${index}`,
          );
          imageIndexes = parseImageIndexes(variant, index);
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(400, `Invalid JSON format in variant ${index}`);
        }

        // Map image URLs based on imageIndexes
        const imageUrls = getUploadedImageUrls(
          imageIndexes,
          imageResults,
          index,
        );
        if (imageUrls.length === 0) {
          throw new AppError(
            400,
            `Variant at index ${index} must have at least one product image`,
          );
        }

        return {
          ...variant,
          ...parseVariantMrkFields(variant),
          sku: resolveSku(variant.sku, name, index),
          price: parsePrice(variant.price, index),
          stock: parseStock(variant.stock, index),
          lowStockThreshold: parseLowStockThreshold(
            variant.lowStockThreshold,
            index,
          ),
          attributes,
          images: imageUrls,
        };
      });

      // Create product
      const product = await this.productService.createProduct({
        name,
        description,
        ...mrkProductFields,
        isNew: isNew === "true",
        isTrending: isTrending === "true",
        isBestSeller: isBestSeller === "true",
        isFeatured: isFeatured === "true",
        ...(categoryId && { categoryId }),
        variants: processedVariants,
      });

      // Send response
      res.status(201).json({
        status: "success",
        data: { product },
        message: "Product created successfully",
      });
    },
  );

  updateProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const {
        name,
        description,
        categoryId,
        isNew,
        isFeatured,
        isTrending,
        isBestSeller,
      } = req.body;
      const mrkProductFields = parseProductMrkFields(req.body);

      console.log("req.body:", req.body, "req.files:", req.files);
      validateProductPayload(req.body, { requireAll: false });

      const parsedVariants = parseVariantsFromBody(req.body);

      // Process files for each variant
      const files = (req.files as Express.Multer.File[]) || [];
      const processedVariants = parsedVariants.length
        ? await Promise.all(
            parsedVariants.map(async (variant: any, index: number) => {
              const variantFiles = getVariantFilesFromImageIndexes(
                variant,
                files,
                index,
              );

              // Upload files to Cloudinary
              let imageUrls: string[] = [];
              if (variantFiles.length > 0) {
                try {
                  const uploadedImages = await uploadToCloudinary(variantFiles);
                  if (uploadedImages.length !== variantFiles.length) {
                    throw new AppError(
                      400,
                      `Failed to upload images at variant index ${index}`,
                    );
                  }
                  imageUrls = uploadedImages
                    .map((img) => img.url)
                    .filter(Boolean);
                } catch (error) {
                  console.error("Cloudinary upload error:", error);
                  throw new AppError(
                    400,
                    `Failed to upload images at variant index ${index}`,
                  );
                }
              }

              // Validate images from req.body
              const bodyImages = parseJsonArrayField(
                variant.images,
                `images at variant index ${index}`,
              );
              if (
                bodyImages.some((img: any) => img && typeof img !== "string")
              ) {
                throw new AppError(
                  400,
                  `Images at variant index ${index} must be an array of strings or empty`,
                );
              }

              // Combine uploaded images with body images
              imageUrls = [
                ...imageUrls,
                ...bodyImages.filter((img: string) => img),
              ];
              validateVariantImageCount(imageUrls.length, index);
              if (imageUrls.length === 0) {
                throw new AppError(
                  400,
                  `Variant at index ${index} must have at least one product image`,
                );
              }

              const sku = resolveSku(variant.sku, name || "MRK-PRODUCT", index);
              const price = parsePrice(variant.price, index);
              const stock = parseStock(variant.stock, index);
              const lowStockThreshold = parseLowStockThreshold(
                variant.lowStockThreshold,
                index,
              );

              // Validate attributes
              let parsedAttributes;
              try {
                parsedAttributes = parseJsonArrayField(
                  variant.attributes,
                  `attributes at variant index ${index}`,
                );
                parsedAttributes.forEach((attr: any, attrIndex: number) => {
                  if (!attr.attributeId || !attr.valueId) {
                    throw new AppError(
                      400,
                      `Invalid attribute structure in variant at index ${index}, attribute index ${attrIndex}`,
                    );
                  }
                });
              } catch (error) {
                if (error instanceof AppError) throw error;
                throw new AppError(
                  400,
                  `Invalid attributes format at index ${index}`,
                );
              }

              // Check for duplicate attributes
              const attributeIds = parsedAttributes.map(
                (attr: any) => attr.attributeId,
              );
              if (new Set(attributeIds).size !== attributeIds.length) {
                throw new AppError(
                  400,
                  `Duplicate attributes in variant at index ${index}`,
                );
              }

              return {
                ...variant,
                ...parseVariantMrkFields(variant),
                sku,
                price,
                stock,
                lowStockThreshold,
                images: imageUrls,
                attributes: parsedAttributes,
              };
            }),
          )
        : undefined;

      if (processedVariants) {
        // Check for duplicate SKUs
        const skuKeys = processedVariants.map((variant: any) => variant.sku);
        if (new Set(skuKeys).size !== skuKeys.length) {
          throw new AppError(400, "Duplicate SKUs detected");
        }

        // Check for duplicate attribute combinations
        const comboKeys = processedVariants
          .map((variant: any) =>
            variant.attributes
              .map((attr: any) => `${attr.attributeId}:${attr.valueId}`)
              .sort()
              .join("|"),
          )
          .filter(Boolean);
        if (new Set(comboKeys).size !== comboKeys.length) {
          throw new AppError(400, "Duplicate attribute combinations detected");
        }
      }

      const updatedData: any = {
        ...(name && { name, slug: slugify(name) }),
        ...(description && { description }),
        ...mrkProductFields,
        ...(isNew !== undefined && { isNew: isNew === "true" }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === "true" }),
        ...(isTrending !== undefined && { isTrending: isTrending === "true" }),
        ...(isBestSeller !== undefined && {
          isBestSeller: isBestSeller === "true",
        }),
        ...(categoryId && { categoryId }),
        ...(processedVariants && { variants: processedVariants }),
      };

      const product = await this.productService.updateProduct(
        productId,
        updatedData,
      );

      sendResponse(res, 200, {
        data: { product },
        message: "Product updated successfully",
      });
      this.logsService.info("Product updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
      });
    },
  );

  bulkCreateProducts = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    const result = await this.productService.bulkCreateProducts(file!);

    sendResponse(res, 201, {
      data: { count: result.count },
      message: `${result.count} products created successfully`,
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Bulk Products created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  deleteProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      await this.productService.deleteProduct(productId);
      sendResponse(res, 200, { message: "Product deleted successfully" });
      const start = Date.now();
      const end = Date.now();

      this.logsService.info("Product deleted", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    },
  );
}
