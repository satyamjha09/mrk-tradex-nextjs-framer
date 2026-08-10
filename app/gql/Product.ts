// @ts-nocheck
import { gql } from "@apollo/client";

export const GET_PRODUCTS_SUMMARY = gql`
  query GetFlaggedProducts($first: Int, $flags: [String!]) {
    products(first: $first, filters: { flags: $flags }) {
      products {
        id
        slug
        name
        isNew
        isFeatured
        isTrending
        isBestSeller
        averageRating
        reviewCount
        variants {
          id
          sku
          price
          priceVisible
          images
          stock
          stockVisible
          hp
          phase
          meterDisplayType
          isActive
          sortOrder
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {
    products(first: $first, skip: $skip, filters: $filters) {
      products {
        id
        name
        slug
        modelNumber
        productSeries
        isNew
        isFeatured
        isTrending
        isBestSeller
        averageRating
        reviewCount
        variants {
          id
          sku
          price
          priceVisible
          images
          stock
          stockVisible
          lowStockThreshold
          barcode
          warehouseLocation
          hp
          hpMin
          hpMax
          phase
          variantType
          maxLoadAmps
          boxType
          bodyType
          meterType
          meterDisplayType
          meterSize
          startCapacitor
          runCapacitor
          mcbRelayOlp
          warranty
          protectionFeatures
          manualUrl
          videoUrl
          isActive
          sortOrder
        }
        category {
          id
          name
          slug
        }
        reviews {
          id
          rating
          comment
        }
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_SINGLE_PRODUCT = gql`
  query GetSingleProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      shortDescription
      modelNumber
      tagline
      productLine
      productSeries
      phase
      hp
      boxType
      meterType
      startCapacitor
      runCapacitor
      capacitor
      maxLoad
      mcbRelayOlp
      warranty
      voltage
      ampRating
      suitableFor
      protectionFeatures
      useCases
      manualUrl
      videoUrl
      featuredVideoUrl
      isCatalogVisible
      enquiryEnabled
      isNew
      isFeatured
      isTrending
      isBestSeller
      averageRating
      reviewCount
      description
      variants {
        id
        sku
        price
        priceVisible
        images
        stock
        stockVisible
        lowStockThreshold
        barcode
        warehouseLocation
        hp
        hpMin
        hpMax
        phase
        variantType
        maxLoadAmps
        boxType
        bodyType
        meterType
        meterDisplayType
        meterSize
        startCapacitor
        runCapacitor
        mcbRelayOlp
        warranty
        protectionFeatures
        manualUrl
        videoUrl
        isActive
        sortOrder
        attributes {
          id
          attribute {
            id
            name
            slug
          }
          value {
            id
            value
            slug
          }
        }
      }
      category {
        id
        name
        slug
      }
      reviews {
        id
        rating
        comment
        user {
          id
          name
          email
        }
        createdAt
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      slug
      name
      description
    }
  }
`;
