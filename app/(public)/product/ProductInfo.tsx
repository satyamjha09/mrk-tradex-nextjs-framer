// @ts-nocheck
"use client";
import { Product } from "@/app/types/productTypes";

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  description: string;
  variants: Product["variants"];
  selectedVariant: Product["variants"][0] | null;
  onVariantChange: (attributeName: string, value: string) => void;
  attributeGroups: Record<string, { values: Set<string> }>;
  selectedAttributes: Record<string, string>;
  resetSelections: () => void;
  manualUrl?: string | null;
  product?: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  description,
  variants,
  selectedVariant,
  product,
}) => {
  const displayVariant = selectedVariant || variants[0];
  const price = displayVariant?.price || 0;
  const priceVisible = displayVariant?.priceVisible ?? true;
  const modelName = product?.modelNumber || name;
  const hp = displayVariant?.hp || product?.hp;
  const capacitor =
    displayVariant?.startCapacitor ||
    displayVariant?.runCapacitor ||
    product?.capacitor ||
    product?.startCapacitor ||
    product?.runCapacitor;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
          Model Name
        </p>
        <h1 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
          {modelName}
        </h1>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          MRP
        </p>
        <p className="text-3xl font-bold text-gray-950 sm:text-4xl">
          {priceVisible
            ? `Rs. ${price.toLocaleString("en-IN")}`
            : "Available on enquiry"}
        </p>
      </div>

      {(hp || capacitor) && (
        <div className="grid gap-3 border-t border-gray-200 pt-6 sm:grid-cols-2">
          {hp && (
            <div className="space-y-1 rounded-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                HP
              </p>
              <p className="text-lg font-semibold text-gray-900">{hp}</p>
            </div>
          )}
          {capacitor && (
            <div className="space-y-1 rounded-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Capacitor
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {capacitor}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>
        <p className="text-base leading-7 text-gray-600">
          {description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
