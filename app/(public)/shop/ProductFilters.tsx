// @ts-nocheck
"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { X, SlidersHorizontal } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import CheckBox from "@/app/components/atoms/CheckBox";
import { debounce } from "lodash";

export interface FilterValues {
  search: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  phase?: string;
  meterDisplayType?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

interface ProductFiltersProps {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  categories: Array<{ id: string; name: string }>;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  initialFilters,
  onFilterChange,
  categories,
  isMobile = false,
  onCloseMobile,
}) => {
  const { control, watch, reset, handleSubmit } = useForm<FilterValues>({
    defaultValues: initialFilters,
  });

  // Watch form values
  const formValues = watch();

  // Debounced search update
  const debouncedSearch = debounce((searchValue: string) => {
    onFilterChange({ ...formValues, search: searchValue });
  }, 500);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  // Handle form submission (Apply Filters)
  const onSubmit = (data: FilterValues) => {
    onFilterChange(data);
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  // Reset all filters
  const handleReset = () => {
    reset({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      phase: undefined,
      meterDisplayType: undefined,
      isNew: undefined,
      isFeatured: undefined,
      isTrending: undefined,
      isBestSeller: undefined,
    });
    onFilterChange({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      phase: undefined,
      meterDisplayType: undefined,
      isNew: undefined,
      isFeatured: undefined,
      isTrending: undefined,
      isBestSeller: undefined,
    });
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  // Format categories for dropdown
  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  const phaseOptions = [
    { label: "Any Phase", value: "" },
    { label: "Single Phase", value: "SINGLE_PHASE" },
    { label: "Three Phase", value: "THREE_PHASE" },
    { label: "Not Applicable", value: "NOT_APPLICABLE" },
  ];

  const meterDisplayOptions = [
    { label: "Any Meter Display", value: "" },
    { label: "Analog", value: "ANALOG" },
    { label: "Digital", value: "DIGITAL" },
    { label: "Not Applicable", value: "NOT_APPLICABLE" },
  ];

  // Count active filters
  const activeFilterCount = Object.values(formValues).filter(
    (value) => value !== undefined && value !== "" && value !== false,
  ).length;

  return (
    <aside
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
        isMobile
          ? "fixed inset-0 z-50 overflow-y-auto"
          : "h-fit"
      }`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-gray-100 ${
            isMobile ? "p-4" : "p-6 pb-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-black" />
            <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-black">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5 font-medium"
              >
                <X size={16} />
                Clear all
              </button>
            )}
            {isMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Content */}
        <div
          className={`flex-1 space-y-6 ${
            isMobile ? "p-4" : "p-6 pt-4"
          } overflow-y-auto`}
        >
          {/* Search */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">
              Search Catalog
            </label>
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Search products, models, HP..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm transition-all duration-200 focus:border-black focus:bg-white focus:outline-none"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleSearchChange(e.target.value);
                  }}
                />
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">
              Category
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={categoryOptions}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val || undefined)}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* MRP Range */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">
              MRP Range
            </label>
            <div className="flex items-center space-x-3">
              <Controller
                name="minPrice"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-all duration-200 focus:border-black focus:bg-white focus:outline-none"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                )}
              />
              <Controller
                name="maxPrice"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-all duration-200 focus:border-black focus:bg-white focus:outline-none"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                )}
              />
            </div>
          </div>

          {/* Technical Filters */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-800">
              Technical Specs
            </label>
            <Controller
              name="phase"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={phaseOptions}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val || undefined)}
                  className="w-full"
                />
              )}
            />
            <Controller
              name="meterDisplayType"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={meterDisplayOptions}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val || undefined)}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Product Flags */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-800">
              Catalog Status
            </label>
            <div className="space-y-4 pl-1">
              <CheckBox name="isNew" control={control} label="New Launches" />
              <CheckBox
                name="isFeatured"
                control={control}
                label="Featured Catalog Items"
              />
              <CheckBox
                name="isTrending"
                control={control}
                label="Frequently Enquired"
              />
              <CheckBox
                name="isBestSeller"
                control={control}
                label="Popular MRK Products"
              />
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div
          className={`border-t border-gray-100 ${
            isMobile ? "p-4" : "p-6 pt-4"
          }`}
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3.5 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ProductFilters;
