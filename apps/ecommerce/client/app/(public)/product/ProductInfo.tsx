"use client";
import Rating from "@/app/components/feedback/Rating";
import useToast from "@/app/hooks/ui/useToast";
import { Product } from "@/app/types/productTypes";
import {
  Palette,
  Ruler,
  Info,
  Package,
  Check,
  X,
  Send,
  Phone,
  MessageCircle,
  MapPinned,
  FileDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCreateMrkEnquiryMutation } from "@/app/store/apis/MrkApi";
import { mrkFeatures } from "@/app/lib/config/features";
import Link from "next/link";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";
import { formatMrkSpecValue } from "@/app/lib/format/mrkSpecs";

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
  id,
  name,
  averageRating,
  reviewCount,
  description,
  variants,
  selectedVariant,
  onVariantChange,
  attributeGroups,
  selectedAttributes,
  resetSelections,
  manualUrl,
  product,
}) => {
  const { showToast } = useToast();
  const { urls } = useMrkSiteSettings();
  const [createEnquiry, { isLoading }] = useCreateMrkEnquiryMutation();
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!enquiryForm.name.trim() || !enquiryForm.phone.trim()) {
      showToast("Name and phone are required", "error");
      return;
    }

    try {
      await createEnquiry({
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        email: enquiryForm.email || undefined,
        city: enquiryForm.city || undefined,
        productId: id,
        variantId: selectedVariant?.id,
        source: "product_detail",
        sourceType: "PRODUCT",
        message:
          enquiryForm.message ||
          `I want to know more about ${name}${
            selectedVariant ? ` (${selectedVariant.sku})` : ""
          }.`,
        metadata: {
          productName: name,
          selectedVariantId: selectedVariant?.id,
          selectedVariantSku: selectedVariant?.sku,
          selectedAttributes,
        },
      }).unwrap();

      setEnquiryForm({ name: "", phone: "", email: "", city: "", message: "" });
      showToast("Enquiry submitted successfully", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to submit enquiry", "error");
      console.error("Error submitting enquiry:", error);
    }
  };

  const price = selectedVariant
    ? selectedVariant.price
    : variants[0]?.price || 0;
  const stock = selectedVariant
    ? selectedVariant.stock
    : variants[0]?.stock || 0;
  const displayVariant = selectedVariant || variants[0];
  const priceVisible = displayVariant?.priceVisible ?? true;
  const stockVisible = displayVariant?.stockVisible ?? false;
  const selectedManualUrl = displayVariant?.manualUrl || manualUrl;
  const technicalRows = [
    ["Model", displayVariant?.sku || product?.modelNumber],
    ["Series", product?.productSeries || product?.productLine],
    ["Phase", displayVariant?.phase || product?.phase],
    ["HP", displayVariant?.hp || product?.hp],
    [
      "Max load",
      displayVariant?.maxLoadAmps
        ? `${displayVariant.maxLoadAmps} A`
        : product?.maxLoad,
    ],
    [
      "Box / body",
      displayVariant?.bodyType || displayVariant?.boxType || product?.boxType,
    ],
    [
      "Meter",
      [
        formatMrkSpecValue(displayVariant?.meterType || product?.meterType),
        formatMrkSpecValue(displayVariant?.meterDisplayType),
      ]
        .filter(Boolean)
        .filter((value, index, values) => values.indexOf(value) === index)
        .join(" / "),
    ],
    ["Meter size", displayVariant?.meterSize],
    [
      "Start capacitor",
      displayVariant?.startCapacitor || product?.startCapacitor,
    ],
    ["Run capacitor", displayVariant?.runCapacitor || product?.runCapacitor],
    ["MCB / Relay / OLP", displayVariant?.mcbRelayOlp || product?.mcbRelayOlp],
    ["Warranty", displayVariant?.warranty || product?.warranty],
    ["Voltage", product?.voltage],
    ["Amp rating", product?.ampRating],
    ["Suitable for", product?.suitableFor],
  ].filter(([, value]) => Boolean(value));
  const protectionFeatures = Array.from(
    new Set([
      ...(product?.protectionFeatures || []),
      ...(displayVariant?.protectionFeatures || []),
    ]),
  );
  const useCases = product?.useCases || [];

  // Compute available colors and sizes
  const colorValues = new Set<string>();
  const sizeValues = new Set<string>();
  variants.forEach((variant) => {
    variant.attributes.forEach(({ attribute, value }) => {
      if (attribute.name.toLowerCase() === "color") {
        colorValues.add(value.value);
      } else if (attribute.name.toLowerCase() === "size") {
        sizeValues.add(value.value);
      }
    });
  });

  // Generate attribute summary
  const attributeSummary = Object.entries(attributeGroups)
    .map(([attrName, { values }]) => {
      const valueList = Array.from(values).join(", ");
      return `${
        attrName.charAt(0).toUpperCase() + attrName.slice(1)
      }: ${valueList}`;
    })
    .join("; ");

  // Color mapping for common colors
  const getColorValue = (colorName: string) => {
    const colorMap: Record<string, string> = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#10b981",
      yellow: "#f59e0b",
      purple: "#8b5cf6",
      pink: "#ec4899",
      orange: "#f97316",
      brown: "#a16207",
      black: "#000000",
      white: "#ffffff",
      gray: "#6b7280",
      grey: "#6b7280",
      navy: "#1e3a8a",
      maroon: "#991b1b",
      teal: "#0d9488",
      lime: "#84cc16",
      indigo: "#6366f1",
      cyan: "#06b6d4",
      amber: "#f59e0b",
      emerald: "#10b981",
      rose: "#f43f5e",
      violet: "#8b5cf6",
      sky: "#0ea5e9",
      slate: "#64748b",
      zinc: "#71717a",
      neutral: "#737373",
      stone: "#78716c",
    };
    return colorMap[colorName.toLowerCase()] || "#6b7280";
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 py-6">
      {/* Product Name */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
        {name}
      </h1>

      {(mrkFeatures.reviewsEnabled || stockVisible) && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          {mrkFeatures.reviewsEnabled && (
            <>
              <Rating rating={averageRating} />
              <span>({reviewCount || 0} reviews)</span>
            </>
          )}
          {stockVisible && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                stock > 0
                  ? "bg-gray-100 text-gray-900"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
        {priceVisible
          ? `MRP from Rs. ${price.toLocaleString("en-IN")}`
          : "MRP available on enquiry"}
      </div>

      {/* Available Options */}
      <div className="space-y-3">
        {colorValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">
              Available in {colorValues.size}{" "}
              {colorValues.size === 1 ? "color" : "colors"}
            </span>
          </div>
        )}

        {sizeValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">
              Available in {sizeValues.size}{" "}
              {sizeValues.size === 1 ? "size" : "sizes"}
            </span>
          </div>
        )}

        {attributeSummary && (
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">{attributeSummary}</span>
          </div>
        )}

        {colorValues.size === 0 &&
          sizeValues.size === 0 &&
          attributeSummary === "" && (
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 text-sm">
                No options available
              </span>
            </div>
          )}
      </div>

      {/* Variant Selection */}
      <div className="space-y-6">
        {Object.entries(attributeGroups).map(([attributeName, { values }]) => {
          const isColor = attributeName.toLowerCase() === "color";
          const isSize = attributeName.toLowerCase() === "size";
          const valuesArray = Array.from(values);

          return (
            <div key={attributeName} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900 capitalize">
                  {attributeName}
                </label>
                {selectedAttributes[attributeName] && (
                  <button
                    onClick={() => onVariantChange(attributeName, "")}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X size={12} />
                    Clear
                  </button>
                )}
              </div>

              {isColor ? (
                // Color Selection with Circles
                <div className="flex flex-wrap gap-3">
                  {valuesArray.map((value) => {
                    const isSelected =
                      selectedAttributes[attributeName] === value;
                    const colorValue = getColorValue(value);
                    const isWhite =
                      colorValue.toLowerCase() === "#ffffff" ||
                      colorValue.toLowerCase() === "#fff";

                    return (
                      <motion.button
                        key={value}
                        onClick={() => onVariantChange(attributeName, value)}
                        className={`relative group ${
                          isSelected
                            ? "ring-2 ring-black ring-offset-2"
                            : "ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-500"
                        } rounded-full transition-all duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colorValue }}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-white"
                            >
                              <Check size={16} />
                            </motion.div>
                          )}
                        </div>
                        {isWhite && (
                          <div className="absolute inset-0 rounded-full border border-gray-300" />
                        )}
                        <span className="sr-only">{value}</span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : isSize ? (
                // Size Selection with Buttons
                <div className="flex flex-wrap gap-2">
                  {valuesArray.map((value) => {
                    const isSelected =
                      selectedAttributes[attributeName] === value;
                    const isOutOfStock = !variants.some(
                      (variant) =>
                        variant.attributes.some(
                          (attr) =>
                            attr.attribute.name === attributeName &&
                            attr.value.value === value,
                        ) && variant.stock > 0,
                    );

                    return (
                      <motion.button
                        key={value}
                        onClick={() =>
                          !isOutOfStock && onVariantChange(attributeName, value)
                        }
                        disabled={isOutOfStock}
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                          isSelected
                            ? "bg-black text-white shadow-lg"
                            : isOutOfStock
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                        }`}
                        whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                        whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                      >
                        {value}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                // Other Attributes with Buttons
                <div className="flex flex-wrap gap-2">
                  {valuesArray.map((value) => {
                    const isSelected =
                      selectedAttributes[attributeName] === value;

                    return (
                      <motion.button
                        key={value}
                        onClick={() => onVariantChange(attributeName, value)}
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                          isSelected
                            ? "bg-black text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {value}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Selected Value Display */}
              {selectedAttributes[attributeName] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="font-medium">Selected:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-900">
                    {selectedAttributes[attributeName]}
                  </span>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Reset Button */}
        {Object.keys(selectedAttributes).length > 0 && (
          <motion.button
            onClick={resetSelections}
            className="inline-flex items-center gap-2 rounded-lg border border-black px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-gray-100 sm:px-4 sm:text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X size={16} />
            Reset All Selections
          </motion.button>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>

      {(technicalRows.length > 0 ||
        protectionFeatures.length > 0 ||
        useCases.length > 0) && (
        <div className="space-y-4 border-t border-gray-200 pt-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Technical Specifications
          </h3>
          {technicalRows.length > 0 && (
            <dl className="grid gap-2 text-sm">
              {technicalRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[0.9fr_1.1fr] gap-3 border-b border-gray-100 py-2"
                >
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">
                    {formatMrkSpecValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {protectionFeatures.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">
                Protection Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {protectionFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {useCases.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">
                Use Cases
              </h4>
              <div className="flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <form onSubmit={handleEnquirySubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={enquiryForm.name}
            onChange={(e) =>
              setEnquiryForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Your name"
            className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
          />
          <input
            type="tel"
            value={enquiryForm.phone}
            onChange={(e) =>
              setEnquiryForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone number"
            className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
          />
          <input
            type="email"
            value={enquiryForm.email}
            onChange={(e) =>
              setEnquiryForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email optional"
            className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
          />
          <input
            type="text"
            value={enquiryForm.city}
            onChange={(e) =>
              setEnquiryForm((prev) => ({ ...prev, city: e.target.value }))
            }
            placeholder="City optional"
            className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
          />
        </div>
        <textarea
          value={enquiryForm.message}
          onChange={(e) =>
            setEnquiryForm((prev) => ({ ...prev, message: e.target.value }))
          }
          placeholder="Tell us your requirement"
          rows={3}
          className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none"
        />
        <button
          disabled={isLoading}
          className={`w-full py-3 sm:py-4 text-sm sm:text-base font-semibold text-white rounded-xl transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting Enquiry...
            </div>
          ) : (
            <span className="inline-flex items-center justify-center gap-2">
              <Send size={18} />
              Enquire Now
            </span>
          )}
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mrkFeatures.dealerLocatorEnabled && (
            <Link
              href="/find-dealer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-gray-100 sm:py-4 sm:text-base"
            >
              <MapPinned size={18} />
              Find a Dealer
            </Link>
          )}
          {selectedManualUrl && mrkFeatures.downloadsEnabled && (
            <a
              href={selectedManualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-gray-100 sm:py-4 sm:text-base"
            >
              <FileDown size={18} />
              Download Manual
            </a>
          )}
          <a
            href={urls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-gray-100 sm:py-4 sm:text-base"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <a
            href={urls.phone}
            className="inline-flex items-center justify-center gap-2 w-full py-3 sm:py-4 text-sm sm:text-base font-semibold border-2 border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            <Phone size={18} />
            Call
          </a>
        </div>
      </form>
    </div>
  );
};

export default ProductInfo;
