// @ts-nocheck
"use client";
import { Controller, UseFormReturn } from "react-hook-form";
import { Tag } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import { ProductFormData } from "./product.types";
import CheckBox from "@/app/components/atoms/CheckBox";
import VariantForm from "./VariantForm";

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  categories?: { label: string; value: string }[];
  categoryAttributes?: {
    id: string;
    name: string;
    isRequired: boolean;
    values: { id: string; value: string; slug: string }[];
  }[];
  isLoading?: boolean;
  error?: any;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  onSubmit,
  categories = [],
  categoryAttributes = [],
  isLoading,
  error,
  submitLabel = "Save",
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <div className="relative">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="MRK Three Phase Control Panel"
                />
              )}
            />
            <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 pl-10">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Dropdown
                onChange={(value) => {
                  field.onChange(value);
                  setValue("variants", []); // Reset variants when category changes
                }}
                options={categories}
                value={field.value}
                label="Select product category"
                className="py-[14px]"
              />
            )}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Flags
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CheckBox
            name="isNew"
            control={control}
            label="New Product"
            defaultValue={false}
          />
          <CheckBox
            name="isBestSeller"
            control={control}
            label="Best Seller"
            defaultValue={false}
          />
          <CheckBox
            name="isFeatured"
            control={control}
            label="Featured"
            defaultValue={false}
          />
          <CheckBox
            name="isTrending"
            control={control}
            label="Trending"
            defaultValue={false}
          />
          <CheckBox
            name="isActive"
            control={control}
            label="Active"
            defaultValue={true}
          />
          <CheckBox
            name="isPublished"
            control={control}
            label="Published"
            defaultValue={true}
          />
          <CheckBox
            name="isCatalogVisible"
            control={control}
            label="Catalog Visible"
            defaultValue={true}
          />
          <CheckBox
            name="enquiryEnabled"
            control={control}
            label="Enquiry Enabled"
            defaultValue={true}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder="Demo MRK three phase technical listing for dealer and product enquiries."
              rows={3}
            />
          )}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            MRK Technical Catalog Fields
          </h2>
          <p className="text-sm text-gray-500">
            These fields power the public technical product page and enquiry
            flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["modelNumber", "Model number", "MRK-TP-CP-5HP"],
            ["productLine", "Product line", "Control Panel"],
            ["productSeries", "Product series", "Three Phase Panel"],
            ["tagline", "Tagline", "Three phase motor protection panel"],
            ["hp", "HP / HP range", "5 HP"],
            ["boxType", "Box / body", "Powder coated metal enclosure"],
            ["meterType", "Meter", "Digital"],
            ["startCapacitor", "Start capacitor", "Optional"],
            ["runCapacitor", "Run capacitor", "Optional"],
            ["capacitor", "Capacitor", "As per model"],
            ["maxLoad", "Maximum load", "15 A"],
            ["mcbRelayOlp", "MCB / Relay / OLP", "MCB + relay + OLP"],
            ["warranty", "Warranty", "12 months"],
            ["voltage", "Voltage", "415 V"],
            ["ampRating", "Amp rating", "15 A"],
            ["suitableFor", "Suitable for", "Agriculture pump"],
            ["manualUrl", "Manual URL", "https://..."],
            ["videoUrl", "Video URL", "https://..."],
            ["featuredVideoUrl", "Featured video URL", "https://..."],
            ["seoTitle", "SEO title", "MRK Three Phase Control Panel"],
            ["seoDescription", "SEO description", "Three phase technical listing for dealer enquiries"],
          ].map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <Controller
                name={name as keyof ProductFormData}
                control={control}
                render={({ field }) => (
                  <input
                    value={(field.value as string | number | undefined) ?? ""}
                    onChange={field.onChange}
                    type="text"
                    placeholder={placeholder}
                    className="px-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                )}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phase
            </label>
            <Controller
              name="phase"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="px-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select phase</option>
                  <option value="SINGLE_PHASE">Single phase</option>
                  <option value="THREE_PHASE">Three phase</option>
                  <option value="NOT_APPLICABLE">Not applicable</option>
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort order
            </label>
            <Controller
              name="sortOrder"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="px-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["shortDescription", "Short description", "Three phase motor control panel for agricultural and industrial pump loads."],
            ["protectionFeatures", "Protection features, comma separated", "Single phasing, Overload, Voltage guard"],
            ["useCases", "Use cases, comma separated", "Agriculture pump, Industrial water transfer"],
          ].map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <Controller
                name={name as keyof ProductFormData}
                control={control}
                render={({ field }) => (
                  <textarea
                    value={(field.value as string | undefined) ?? ""}
                    onChange={field.onChange}
                    rows={3}
                    placeholder={placeholder}
                    className="px-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <VariantForm form={form} categoryAttributes={categoryAttributes} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-600 text-sm font-medium">
            {error.data?.message || "An error occurred"}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 text-white rounded-lg shadow-md font-medium flex items-center justify-center min-w-24 ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          } transition-all duration-200`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
