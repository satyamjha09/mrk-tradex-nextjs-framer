"use client";
import Table from "@/app/components/layout/Table";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/app/store/apis/ProductApi";
import { useState } from "react";
import ProductModal from "./ProductModal";
import { Trash2, Edit, Upload, X } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import useToast from "@/app/hooks/ui/useToast";
import ProductFileUpload from "./ProductFileUpload";
import { usePathname } from "next/navigation";
import { ProductFormData } from "./product.types";
import { withAuth } from "@/app/components/HOC/WithAuth";

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

const normalizeVariant = (
  variant: any,
): ProductFormData["variants"][number] => ({
  id: variant.id || "",
  sku: variant.sku || "",
  price: variant.price || 0,
  priceVisible: variant.priceVisible ?? true,
  images: variant.images || [],
  stock: variant.stock || 0,
  stockVisible: variant.stockVisible ?? false,
  lowStockThreshold: variant.lowStockThreshold || 10,
  barcode: variant.barcode || "",
  warehouseLocation: variant.warehouseLocation || "",
  hp: variant.hp || "",
  hpMin: variant.hpMin ?? undefined,
  hpMax: variant.hpMax ?? undefined,
  phase: variant.phase || "",
  variantType: variant.variantType || "",
  maxLoadAmps: variant.maxLoadAmps ?? undefined,
  boxType: variant.boxType || "",
  bodyType: variant.bodyType || "",
  meterType: variant.meterType || "",
  meterDisplayType: variant.meterDisplayType || "",
  meterSize: variant.meterSize || "",
  startCapacitor: variant.startCapacitor || "",
  runCapacitor: variant.runCapacitor || "",
  mcbRelayOlp: variant.mcbRelayOlp || "",
  warranty: variant.warranty || "",
  protectionFeatures: Array.isArray(variant.protectionFeatures)
    ? variant.protectionFeatures.join(", ")
    : variant.protectionFeatures || "",
  installationInfo:
    typeof variant.installationInfo === "string"
      ? variant.installationInfo
      : variant.installationInfo?.text || "",
  manualUrl: variant.manualUrl || "",
  videoUrl: variant.videoUrl || "",
  isActive: variant.isActive ?? true,
  sortOrder: variant.sortOrder || 0,
  attributes: variant.attributes || [],
});

const ProductsDashboard = () => {
  const { showToast } = useToast();
  const [createProduct, { isLoading: isCreating, error: createError }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating, error: updateError }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const pathname = usePathname();
  const shouldFetchProducts = pathname === "/dashboard/products";

  const { data, isLoading } = useGetAllProductsQuery(
    { select: { variants: true } }, // Ensure variants are included
    { skip: !shouldFetchProducts },
  );
  const products = data?.products || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(
    null,
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const handleCreateProduct = async (data: ProductFormData) => {
    const payload = new FormData();
    appendProductFields(payload, data);

    const imageIndexRef = { value: 0 };
    data.variants.forEach((variant, index) => {
      appendVariantFields(payload, variant, index, imageIndexRef);
    });

    try {
      await createProduct(payload).unwrap();
      setIsModalOpen(false);
      showToast("Product created successfully", "success");
    } catch (err) {
      console.error("Failed to create product:", err);
      showToast("Failed to create product", "error");
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    const payload = new FormData();
    appendProductFields(payload, data);
    const imageIndexRef = { value: 0 };
    data.variants.forEach((variant, index) => {
      appendVariantFields(payload, variant, index, imageIndexRef);
    });

    try {
      await updateProduct({
        id: editingProduct.id!,
        data: payload,
      }).unwrap();
      setIsModalOpen(false);
      setEditingProduct(null);
      showToast("Product updated successfully", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product", "error");
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
      showToast("Product deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product", "error");
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  const handleFileUploadSuccess = () => {};

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "variants",
      label: "Variants",
      sortable: false,
      render: (row: any) => (
        <div>
          {row.variants?.length > 0 ? (
            row.variants.map((v: any) => (
              <span
                key={v.id}
                className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded"
              >
                {v.sku}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No variants</span>
          )}
        </div>
      ),
    },
    {
      key: "salesCount",
      label: "Sales Count",
      sortable: true,
      render: (row: any) => row.salesCount,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingProduct({
                id: row.id,
                name: row.name,
                isNew: row.isNew,
                isTrending: row.isTrending,
                isBestSeller: row.isBestSeller,
                isFeatured: row.isFeatured,
                isActive: row.isActive ?? true,
                isPublished: row.isPublished ?? true,
                isCatalogVisible: row.isCatalogVisible ?? true,
                enquiryEnabled: row.enquiryEnabled ?? true,
                sortOrder: row.sortOrder || 0,
                categoryId: row.categoryId,
                description: row.description || "",
                shortDescription: row.shortDescription || "",
                modelNumber: row.modelNumber || "",
                tagline: row.tagline || "",
                productLine: row.productLine || "",
                productSeries: row.productSeries || "",
                phase: row.phase || "",
                hp: row.hp || "",
                boxType: row.boxType || "",
                meterType: row.meterType || "",
                startCapacitor: row.startCapacitor || "",
                runCapacitor: row.runCapacitor || "",
                capacitor: row.capacitor || "",
                maxLoad: row.maxLoad || "",
                mcbRelayOlp: row.mcbRelayOlp || "",
                warranty: row.warranty || "",
                voltage: row.voltage || "",
                ampRating: row.ampRating || "",
                suitableFor: row.suitableFor || "",
                protectionFeatures: Array.isArray(row.protectionFeatures)
                  ? row.protectionFeatures.join(", ")
                  : row.protectionFeatures || "",
                useCases: Array.isArray(row.useCases)
                  ? row.useCases.join(", ")
                  : row.useCases || "",
                manualUrl: row.manualUrl || "",
                videoUrl: row.videoUrl || "",
                featuredVideoUrl: row.featuredVideoUrl || "",
                seoTitle: row.seoTitle || "",
                seoDescription: row.seoDescription || "",
                variants: row.variants?.map(normalizeVariant) || [],
              });
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id)}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting && productToDelete === row.id
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Product List</h1>
          <p className="text-sm text-gray-500">Manage and view your products</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsFileUploadOpen(!isFileUploadOpen)}
            className="px-4 py-2 bg-[#5d8a02] text-white rounded-md flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Excel Sheet
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Product
          </button>
        </div>
      </div>

      {isFileUploadOpen && (
        <div className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Import Products</h2>
            <button
              onClick={() => setIsFileUploadOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <ProductFileUpload onUploadSuccess={handleFileUploadSuccess} />
        </div>
      )}

      <Table
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products available"
        onRefresh={() => console.log("refreshed")}
        totalPages={data?.totalPages}
        totalResults={data?.totalResults}
        resultsPerPage={data?.resultsPerPage}
        currentPage={data?.currentPage}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct || undefined}
        isLoading={editingProduct ? isUpdating : isCreating}
        error={editingProduct ? updateError : createError}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default withAuth(ProductsDashboard);
