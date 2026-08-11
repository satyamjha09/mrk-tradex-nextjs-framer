// @ts-nocheck
"use client";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import ImageUploader from "@/app/components/molecules/ImageUploader";
import { ProductFormData } from "./product.types";

interface VariantFormProps {
  form: UseFormReturn<ProductFormData>;
  categoryAttributes: {
    id: string;
    name: string;
    isRequired: boolean;
    values: { id: string; value: string; slug: string }[];
  }[];
}

const VariantForm: React.FC<VariantFormProps> = ({
  form,
  categoryAttributes,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const inputStyles =
    "w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Product Variants
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              id: "",
              sku: "",
              price: 0,
              stock: 0,
              lowStockThreshold: 10,
              priceVisible: true,
              stockVisible: false,
              barcode: "",
              warehouseLocation: "",
              hp: "",
              hpMin: undefined,
              hpMax: undefined,
              phase: "",
              variantType: "",
              maxLoadAmps: undefined,
              boxType: "",
              bodyType: "",
              meterType: "",
              meterDisplayType: "",
              meterSize: "",
              startCapacitor: "",
              runCapacitor: "",
              mcbRelayOlp: "",
              warranty: "",
              protectionFeatures: "",
              installationInfo: "",
              manualUrl: "",
              videoUrl: "",
              isActive: true,
              sortOrder: 0,
              images: [],
              attributes: categoryAttributes.map((attr) => ({
                attributeId: attr.id,
                valueId: "",
              })),
            })
          }
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={20} /> Add Variant
        </button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-lg p-4 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-800">
              Variant {index + 1}
            </h3>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-gray-400">(optional)</span>
              </label>
              <Controller
                name={`variants.${index}.sku`}
                control={control}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9-]*$/,
                    message: "SKU must be alphanumeric with dashes",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={inputStyles}
                    placeholder="Auto-generated if blank"
                  />
                )}
              />
              {errors.variants?.[index]?.sku && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].sku?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MRP <span className="text-red-500">*</span>
              </label>
              <Controller
                name={`variants.${index}.price`}
                control={control}
                rules={{
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be positive" },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    className={inputStyles}
                    placeholder="6450"
                  />
                )}
              />
              {errors.variants?.[index]?.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].price?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-gray-400">(optional)</span>
              </label>
              <Controller
                name={`variants.${index}.stock`}
                control={control}
                rules={{
                  min: { value: 0, message: "Stock cannot be negative" },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className={inputStyles}
                  placeholder="0"
                  />
                )}
              />
              {errors.variants?.[index]?.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].stock?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold
              </label>
              <Controller
                name={`variants.${index}.lowStockThreshold`}
                control={control}
                rules={{ min: { value: 0, message: "Cannot be negative" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className={inputStyles}
                    placeholder="10"
                  />
                )}
              />
              {errors.variants?.[index]?.lowStockThreshold && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].lowStockThreshold?.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name={`variants.${index}.priceVisible`}
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(field.value)}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                    Show MRP
                  </label>
                )}
              />
              <Controller
                name={`variants.${index}.stockVisible`}
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(field.value)}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                    Show stock
                  </label>
                )}
              />
              <Controller
                name={`variants.${index}.isActive`}
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={field.value !== false}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                    Active
                  </label>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barcode
              </label>
              <Controller
                name={`variants.${index}.barcode`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={inputStyles}
                    placeholder="123456789012"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse Location
              </label>
              <Controller
                name={`variants.${index}.warehouseLocation`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={inputStyles}
                    placeholder="WH-A1"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HP / HP Range
              </label>
              <Controller
                name={`variants.${index}.hp`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={inputStyles}
                  placeholder="5 HP"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HP Min
                </label>
                <Controller
                  name={`variants.${index}.hpMin`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.1"
                      className={inputStyles}
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HP Max
                </label>
                <Controller
                  name={`variants.${index}.hpMax`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.1"
                      className={inputStyles}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phase
              </label>
              <Controller
                name={`variants.${index}.phase`}
                control={control}
                render={({ field }) => (
                  <select {...field} className={inputStyles}>
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
                Max Load Amps
              </label>
              <Controller
                name={`variants.${index}.maxLoadAmps`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.1"
                    className={inputStyles}
                  />
                )}
              />
            </div>

            {[
              ["variantType", "Variant / starter type", "Control panel"],
              ["boxType", "Box type", "Powder coated metal enclosure"],
              ["bodyType", "Body type", "Powder coated metal enclosure"],
              ["meterType", "Meter type", "Digital"],
              ["meterSize", "Meter size", "96 x 96 mm"],
              ["startCapacitor", "Start capacitor", "e.g. 100-120 mfd"],
              ["runCapacitor", "Run capacitor", "e.g. 36 mfd"],
              ["mcbRelayOlp", "MCB / Relay / OLP", "MCB + relay + OLP"],
            ].map(([name, label, placeholder]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <Controller
                  name={`variants.${index}.${name}` as any}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={inputStyles}
                      placeholder={placeholder}
                    />
                  )}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meter Display
              </label>
              <Controller
                name={`variants.${index}.meterDisplayType`}
                control={control}
                render={({ field }) => (
                  <select {...field} className={inputStyles}>
                    <option value="">Select meter display</option>
                    <option value="ANALOG">Analog</option>
                    <option value="DIGITAL">Digital</option>
                    <option value="NOT_APPLICABLE">Not applicable</option>
                  </select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty
              </label>
              <Controller
                name={`variants.${index}.warranty`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={inputStyles}
                    placeholder="12 months"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manual URL
              </label>
              <Controller
                name={`variants.${index}.manualUrl`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={inputStyles}
                    placeholder="https://..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demo / How-to Video URL
              </label>
              <Controller
                name={`variants.${index}.videoUrl`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={inputStyles}
                    placeholder="https://..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <Controller
                name={`variants.${index}.sortOrder`}
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className={inputStyles} />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protection Features
              </label>
              <Controller
                name={`variants.${index}.protectionFeatures`}
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    className={inputStyles}
                    placeholder="Comma-separated protection features"
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation / Connection Info
              </label>
              <Controller
                name={`variants.${index}.installationInfo`}
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    className={inputStyles}
                    placeholder="Connection notes or installation guidance"
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploader
                control={control}
                errors={errors}
                setValue={setValue}
                label="Variant Images"
                name={`variants.${index}.images`}
                maxFiles={4}
                rules={{
                  validate: (images: unknown[]) =>
                    Array.isArray(images) && images.length > 0
                      ? true
                      : "At least one product image is required",
                }}
              />
              {errors.variants?.[index]?.images && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.variants[index].images?.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Attributes</h4>
            {categoryAttributes.map((attr, attrIndex) => (
              <div key={attr.id}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {attr.name}{" "}
                  {attr.isRequired && <span className="text-red-500">*</span>}
                </label>
                <Controller
                  name={`variants.${index}.attributes[${attrIndex}].valueId`}
                  control={control}
                  rules={
                    attr.isRequired
                      ? { required: `${attr.name} is required` }
                      : undefined
                  }
                  render={({ field }) => (
                    <Dropdown
                      options={attr.values.map((v) => ({
                        label: v.value,
                        value: v.id,
                      }))}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue(
                          `variants.${index}.attributes[${attrIndex}].attributeId`,
                          attr.id,
                        );
                      }}
                      label={`Select ${attr.name}`}
                      className="p-2"
                    />
                  )}
                />
                {errors.variants?.[index]?.attributes?.[attrIndex]?.valueId && (
                  <p className="text-red-500 text-xs mt-1">
                    {
                      errors.variants[index].attributes?.[attrIndex]?.valueId
                        ?.message
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {errors.variants && !Array.isArray(errors.variants) && (
        <p className="text-red-500 text-xs mt-2">
          At least one variant is required
        </p>
      )}
    </div>
  );
};

export default VariantForm;
