// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "@/app/store/apis/ProductApi";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import useToast from "@/app/hooks/ui/useToast";
import { ProductFormData } from "@/app/(private)/dashboard/products/product.types";

const productTextFields: (keyof ProductFormData)[] = [
  "shortDescription",
  "modelNumber",
  "tagline",
  "productLine",
  "productSeries",
  "phase",
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
  "protectionFeatures",
  "useCases",
  "manualUrl",
  "videoUrl",
  "featuredVideoUrl",
  "seoTitle",
  "seoDescription",
];

const productBooleanFields: (keyof ProductFormData)[] = [
  "isActive",
  "isPublished",
  "isCatalogVisible",
  "enquiryEnabled",
];

const variantFields = [
  "id",
  "sku",
  "price",
  "stock",
  "lowStockThreshold",
  "barcode",
  "warehouseLocation",
  "priceVisible",
  "stockVisible",
  "hp",
  "hpMin",
  "hpMax",
  "phase",
  "variantType",
  "maxLoadAmps",
  "boxType",
  "bodyType",
  "meterType",
  "meterDisplayType",
  "meterSize",
  "startCapacitor",
  "runCapacitor",
  "mcbRelayOlp",
  "warranty",
  "protectionFeatures",
  "installationInfo",
  "manualUrl",
  "videoUrl",
  "isActive",
  "sortOrder",
] as const;

const appendValue = (payload: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  payload.append(
    key,
    Array.isArray(value) ? JSON.stringify(value) : String(value),
  );
};

const appendProductFields = (payload: FormData, data: ProductFormData) => {
  appendValue(payload, "name", data.name || "");
  appendValue(payload, "description", data.description || "");
  appendValue(payload, "categoryId", data.categoryId || "");
  appendValue(payload, "isNew", data.isNew);
  appendValue(payload, "isTrending", data.isTrending);
  appendValue(payload, "isBestSeller", data.isBestSeller);
  appendValue(payload, "isFeatured", data.isFeatured);
  productBooleanFields.forEach((field) =>
    appendValue(payload, field, data[field]),
  );
  productTextFields.forEach((field) =>
    appendValue(payload, field, data[field]),
  );
  appendValue(payload, "sortOrder", data.sortOrder);
};

const appendVariantFields = (
  payload: FormData,
  variant: ProductFormData["variants"][number],
  index: number,
  imageIndexRef: { value: number },
) => {
  variantFields.forEach((field) => {
    appendValue(payload, `variants[${index}][${field}]`, variant[field]);
  });
  appendValue(
    payload,
    `variants[${index}][attributes]`,
    JSON.stringify(variant.attributes || []),
  );

  const existingImageUrls: string[] = [];
  const imageIndexes = ((variant.images || []) as unknown[])
    .map((image) => {
      if (image instanceof File) {
        payload.append("images", image);
        return imageIndexRef.value++;
      }
      if (typeof image === "string") {
        existingImageUrls.push(image);
      }
      return null;
    })
    .filter((idx): idx is number => idx !== null);

  appendValue(
    payload,
    `variants[${index}][imageIndexes]`,
    JSON.stringify(imageIndexes),
  );
  if (existingImageUrls.length > 0) {
    appendValue(
      payload,
      `variants[${index}][images]`,
      JSON.stringify(existingImageUrls),
    );
  }
};

export const useProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    data: product,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductByIdQuery(id);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery({});

  const categories =
    categoriesData?.categories.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Form setup with initial empty default values
  const form = useForm<ProductFormData>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      categoryId: "",
      isNew: false,
      isTrending: false,
      isBestSeller: false,
      isFeatured: false,
      isActive: true,
      isPublished: true,
      isCatalogVisible: true,
      enquiryEnabled: true,
      sortOrder: 0,
      variants: [],
    },
  });

  // Reset form and selected variant when product data is fetched
  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id || "",
        name: product.name || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        isNew: product.isNew || false,
        isTrending: product.isTrending || false,
        isBestSeller: product.isBestSeller || false,
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true,
        isPublished: product.isPublished ?? true,
        isCatalogVisible: product.isCatalogVisible ?? true,
        enquiryEnabled: product.enquiryEnabled ?? true,
        sortOrder: product.sortOrder || 0,
        shortDescription: product.shortDescription || "",
        modelNumber: product.modelNumber || "",
        tagline: product.tagline || "",
        productLine: product.productLine || "",
        productSeries: product.productSeries || "",
        phase: product.phase || "",
        hp: product.hp || "",
        boxType: product.boxType || "",
        meterType: product.meterType || "",
        startCapacitor: product.startCapacitor || "",
        runCapacitor: product.runCapacitor || "",
        capacitor: product.capacitor || "",
        maxLoad: product.maxLoad || "",
        mcbRelayOlp: product.mcbRelayOlp || "",
        warranty: product.warranty || "",
        voltage: product.voltage || "",
        ampRating: product.ampRating || "",
        suitableFor: product.suitableFor || "",
        protectionFeatures: Array.isArray(product.protectionFeatures)
          ? product.protectionFeatures.join(", ")
          : product.protectionFeatures || "",
        useCases: Array.isArray(product.useCases)
          ? product.useCases.join(", ")
          : product.useCases || "",
        manualUrl: product.manualUrl || "",
        videoUrl: product.videoUrl || "",
        featuredVideoUrl: product.featuredVideoUrl || "",
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        variants:
          product.variants?.map((v) => ({
            id: v.id || "",
            sku: v.sku || "",
            price: v.price || 0,
            priceVisible: v.priceVisible ?? true,
            stock: v.stock || 0,
            stockVisible: v.stockVisible ?? false,
            lowStockThreshold: v.lowStockThreshold || 10,
            barcode: v.barcode || "",
            warehouseLocation: v.warehouseLocation || "",
            hp: v.hp || "",
            hpMin: v.hpMin ?? undefined,
            hpMax: v.hpMax ?? undefined,
            phase: v.phase || "",
            variantType: v.variantType || "",
            maxLoadAmps: v.maxLoadAmps ?? undefined,
            boxType: v.boxType || "",
            bodyType: v.bodyType || "",
            meterType: v.meterType || "",
            meterDisplayType: v.meterDisplayType || "",
            meterSize: v.meterSize || "",
            startCapacitor: v.startCapacitor || "",
            runCapacitor: v.runCapacitor || "",
            mcbRelayOlp: v.mcbRelayOlp || "",
            warranty: v.warranty || "",
            protectionFeatures: Array.isArray(v.protectionFeatures)
              ? v.protectionFeatures.join(", ")
              : v.protectionFeatures || "",
            installationInfo:
              typeof v.installationInfo === "string"
                ? v.installationInfo
                : v.installationInfo?.text || "",
            manualUrl: v.manualUrl || "",
            videoUrl: v.videoUrl || "",
            isActive: v.isActive ?? true,
            sortOrder: v.sortOrder || 0,
            attributes: v.attributes || [],
            images: v.images || [],
          })) || [],
      });
      // Set default selected variant to the first one
      setSelectedVariant(product.variants?.[0] || null);
      setSelectedAttributes({});
    }
  }, [product, form]);

  // Handle variant change based on attribute selections
  const handleVariantChange = (attributeName, value) => {
    const newSelections = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newSelections);

    const variant = product?.variants.find((v) =>
      Object.entries(newSelections).every(
        ([attrName, attrValue]) =>
          attrName === "" ||
          v.attributes.some(
            (attr) =>
              attr.attribute?.name === attrName &&
              attr.value?.value === attrValue,
          ),
      ),
    );
    setSelectedVariant(variant || product?.variants?.[0] || null);
  };

  // Reset variant selections
  const resetSelections = () => {
    setSelectedAttributes({});
    setSelectedVariant(product?.variants?.[0] || null);
  };

  // Handle update
  const onSubmit = async (data: ProductFormData) => {
    const payload = new FormData();
    appendProductFields(payload, data);

    const imageIndexRef = { value: 0 };
    data.variants.forEach((variant, index) => {
      appendVariantFields(payload, variant, index, imageIndexRef);
    });

    try {
      await updateProduct({
        id: id as string,
        data: payload,
      }).unwrap();
      showToast("Product updated successfully", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteProduct(id as string).unwrap();
      showToast("Product deleted successfully", "success");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product", "error");
    }
  };

  // Compute attribute groups for variant selection
  const attributeGroups = product?.variants.reduce(
    (acc, variant) => {
      const hasSelections = Object.values(selectedAttributes).some(
        (value) => value !== "",
      );
      const matchesSelections = hasSelections
        ? Object.entries(selectedAttributes).every(
            ([attrName, attrValue]) =>
              attrName === "" ||
              variant.attributes.some(
                (attr) =>
                  attr.attribute?.name === attrName &&
                  attr.value?.value === attrValue,
              ),
          )
        : true;
      if (matchesSelections) {
        variant.attributes.forEach(({ attribute, value }) => {
          if (!acc[attribute.name]) {
            acc[attribute.name] = { values: new Set<string>() };
          }
          acc[attribute.name].values.add(value.value);
        });
      }
      return acc;
    },
    {} as Record<string, { values: Set<string> }>,
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return {
    product,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    form,
    isUpdating,
    isDeleting,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    onSubmit,
    handleDelete,
    router,
    selectedVariant,
    setSelectedVariant,
    selectedAttributes,
    handleVariantChange,
    resetSelections,
    attributeGroups,
  };
};
