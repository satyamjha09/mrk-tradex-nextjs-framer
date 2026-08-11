import AppError from "@/shared/errors/AppError";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

const publicProductWhere = {
  isActive: true,
  isPublished: true,
  isCatalogVisible: true,
};

const publicProductInclude = {
  category: true,
  variants: {
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
    include: {
      attributes: {
        include: {
          attribute: true,
          value: true,
        },
      },
    },
  },
  reviews: true,
};

const activeVariantWhere = { variants: { some: { isActive: true } } };

const publicFlagWhere = (flag: string) => ({
  ...publicProductWhere,
  [flag]: true,
  ...activeVariantWhere,
});

export const productResolvers = {
  Query: {
    products: async (
      _: any,
      {
        first = 10,
        skip = 0,
        filters = {},
      }: {
        first?: number;
        skip?: number;
        filters?: {
          search?: string;
          isNew?: boolean;
          isFeatured?: boolean;
          isTrending?: boolean;
          isBestSeller?: boolean;
          minPrice?: number;
          maxPrice?: number;
          categoryId?: string;
          phase?: string;
          meterDisplayType?: string;
          seriesMatch?: string[];
          flags?: string[];
        };
      },
      context: Context,
    ) => {
      const where: any = { ...publicProductWhere };

      // Search filter. Keep it in AND so it narrows category/flag filters
      // instead of widening them, and include the MRK technical fields users
      // naturally search by on the shop page.
      const searchTerm = filters.search?.trim();
      if (searchTerm) {
        where.AND = [
          ...(where.AND || []),
          {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { modelNumber: { contains: searchTerm, mode: "insensitive" } },
              { productLine: { contains: searchTerm, mode: "insensitive" } },
              { productSeries: { contains: searchTerm, mode: "insensitive" } },
              { shortDescription: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
              { hp: { contains: searchTerm, mode: "insensitive" } },
              { capacitor: { contains: searchTerm, mode: "insensitive" } },
              { startCapacitor: { contains: searchTerm, mode: "insensitive" } },
              { runCapacitor: { contains: searchTerm, mode: "insensitive" } },
              {
                variants: {
                  some: {
                    isActive: true,
                    OR: [
                      { sku: { contains: searchTerm, mode: "insensitive" } },
                      { hp: { contains: searchTerm, mode: "insensitive" } },
                      { startCapacitor: { contains: searchTerm, mode: "insensitive" } },
                      { runCapacitor: { contains: searchTerm, mode: "insensitive" } },
                      { variantType: { contains: searchTerm, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          },
        ];
      }

      // Flag filters
      if (filters.isNew !== undefined) where.isNew = filters.isNew;
      if (filters.isFeatured !== undefined)
        where.isFeatured = filters.isFeatured;
      if (filters.isTrending !== undefined)
        where.isTrending = filters.isTrending;
      if (filters.isBestSeller !== undefined)
        where.isBestSeller = filters.isBestSeller;

      // ✅ OR logic for multiple flags
      if (filters.flags && filters.flags.length > 0) {
        const flagConditions = filters.flags.map((flag) => ({ [flag]: true }));
        if (!where.OR) where.OR = [];
        where.OR = [...where.OR, ...flagConditions];
      }

      // Category filter
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }

      // Series filter. Goes through AND rather than where.OR, which search and
      // flags already claim — the series has to narrow those, not widen them.
      //
      // `startsWith`, not `contains`: the series code always leads the model
      // code (AHD29A, MRG16A, MRX-HD F04), so anchoring to the front is enough
      // to select the series and it stops a code mentioned later in a free-text
      // name from claiming the product. Without the anchor a product named
      // "MRG29A AHD" turns up under both the MRG and the AHD chip.
      if (filters.seriesMatch && filters.seriesMatch.length > 0) {
        where.AND = [
          ...(where.AND || []),
          {
            OR: filters.seriesMatch.flatMap((token) => [
              { modelNumber: { startsWith: token, mode: "insensitive" } },
              { productSeries: { startsWith: token, mode: "insensitive" } },
              { name: { startsWith: token, mode: "insensitive" } },
            ]),
          },
        ];
      }

      const variantSome: any = { isActive: true };

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        variantSome.price = {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        };
      }

      if (filters.phase) {
        variantSome.phase = filters.phase;
      }

      if (filters.meterDisplayType) {
        variantSome.meterDisplayType = filters.meterDisplayType;
      }

      if (Object.keys(variantSome).length > 1) {
        where.variants = { some: variantSome };
      } else {
        where.variants = { some: { isActive: true } };
      }

      if (filters.phase) {
        where.AND = [
          ...(where.AND || []),
          {
            OR: [
              { phase: filters.phase },
              { variants: { some: { isActive: true, phase: filters.phase } } },
            ],
          },
        ];
      }

      if (filters.meterDisplayType) {
        where.AND = [
          ...(where.AND || []),
          {
            variants: {
              some: {
                isActive: true,
                meterDisplayType: filters.meterDisplayType,
              },
            },
          },
        ];
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.AND = [
          ...(where.AND || []),
          {
            variants: {
              some: {
                isActive: true,
                priceVisible: true,
                price: {
                  ...(filters.minPrice !== undefined && {
                    gte: filters.minPrice,
                  }),
                  ...(filters.maxPrice !== undefined && {
                    lte: filters.maxPrice,
                  }),
                },
              },
            },
          },
        ];
      }

      const totalCount = await context.prisma.product.count({ where });
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: publicProductInclude,
      });

      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    product: async (_: any, { slug }: { slug: string }, context: Context) => {
      const product = await context.prisma.product.findFirst({
        where: {
          slug,
          ...publicProductWhere,
          variants: { some: { isActive: true } },
        },
        include: publicProductInclude,
      });
      if (!product) {
        throw new AppError(404, "Product not found");
      }
      return product;
    },
    newProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context,
    ) => {
      const where = publicFlagWhere("isNew");
      const totalCount = await context.prisma.product.count({
        where,
      });
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: publicProductInclude,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    featuredProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context,
    ) => {
      const where = publicFlagWhere("isFeatured");
      const totalCount = await context.prisma.product.count({
        where,
      });
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: publicProductInclude,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    trendingProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context,
    ) => {
      const where = publicFlagWhere("isTrending");
      const totalCount = await context.prisma.product.count({
        where,
      });
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: publicProductInclude,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    bestSellerProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context,
    ) => {
      const where = publicFlagWhere("isBestSeller");
      const totalCount = await context.prisma.product.count({
        where,
      });
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: publicProductInclude,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    categories: async (_: any, __: any, context: Context) => {
      return context.prisma.category.findMany({
        where: {
          isVisible: true,
          products: {
            some: {
              ...publicProductWhere,
              variants: { some: { isActive: true } },
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          products: {
            where: {
              ...publicProductWhere,
              variants: { some: { isActive: true } },
            },
            include: {
              variants: { where: { isActive: true } },
            },
          },
        },
      });
    },
  },

  Product: {
    reviews: (parent: any, _: any, context: Context) => {
      return context.prisma.review.findMany({
        where: { productId: parent.id },
        include: {
          user: true,
        },
      });
    },
  },
};
