import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { productResolvers } from "./resolver";

const typeDefs = gql`
  scalar DateTime

  type Product {
    id: String!
    slug: String!
    name: String!
    description: String
    shortDescription: String
    modelNumber: String
    tagline: String
    productLine: String
    productSeries: String
    phase: String
    hp: String
    boxType: String
    meterType: String
    startCapacitor: String
    runCapacitor: String
    capacitor: String
    maxLoad: String
    mcbRelayOlp: String
    warranty: String
    voltage: String
    ampRating: String
    suitableFor: String
    protectionFeatures: [String!]!
    useCases: [String!]!
    manualUrl: String
    videoUrl: String
    featuredVideoUrl: String
    isCatalogVisible: Boolean!
    enquiryEnabled: Boolean!
    salesCount: Int!
    isNew: Boolean!
    isFeatured: Boolean!
    isTrending: Boolean!
    isBestSeller: Boolean!
    averageRating: Float!
    reviewCount: Int!
    variants: [ProductVariant!]!
    category: Category
    reviews: [Review!]!
  }

  type ProductVariant {
    id: String!
    sku: String!
    images: [String!]!
    price: Float!
    priceVisible: Boolean!
    stock: Int!
    stockVisible: Boolean!
    lowStockThreshold: Int!
    barcode: String
    warehouseLocation: String
    hp: String
    hpMin: Float
    hpMax: Float
    phase: String
    variantType: String
    maxLoadAmps: Float
    boxType: String
    bodyType: String
    meterType: String
    meterDisplayType: String
    meterSize: String
    startCapacitor: String
    runCapacitor: String
    mcbRelayOlp: String
    warranty: String
    protectionFeatures: [String!]!
    manualUrl: String
    videoUrl: String
    isActive: Boolean!
    sortOrder: Int!
    attributes: [ProductVariantAttribute!]!
  }

  type ProductVariantAttribute {
    id: String!
    attribute: Attribute!
    value: AttributeValue!
  }

  type Attribute {
    id: String!
    name: String!
    slug: String!
  }

  type AttributeValue {
    id: String!
    value: String!
    slug: String!
  }

  type Review {
    id: String!
    rating: Int!
    comment: String
    user: User
    createdAt: DateTime!
  }

  type User {
    id: String!
    name: String!
    email: String!
    avatar: String
  }

  type Category {
    id: String!
    slug: String!
    name: String!
    description: String
  }

  type ProductConnection {
    products: [Product!]!
    hasMore: Boolean!
    totalCount: Int!
  }

  input ProductFilters {
    search: String
    isNew: Boolean
    isFeatured: Boolean
    isTrending: Boolean
    isBestSeller: Boolean
    minPrice: Float
    maxPrice: Float
    categoryId: String
    phase: String
    meterDisplayType: String
    """
    Tokens identifying a product series (AHD, MRG, DOL ...). A product matches
    when any token appears in its modelNumber, productSeries, or name. The
    client owns the series taxonomy and sends the tokens for the chosen series.
    """
    seriesMatch: [String!]
    flags: [String!]
  }

  type Query {
    products(first: Int, skip: Int, filters: ProductFilters): ProductConnection!
    product(slug: String!): Product
    newProducts(first: Int, skip: Int): ProductConnection!
    featuredProducts(first: Int, skip: Int): ProductConnection!
    trendingProducts(first: Int, skip: Int): ProductConnection!
    bestSellerProducts(first: Int, skip: Int): ProductConnection!
    categories: [Category!]!
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
