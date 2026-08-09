// @ts-nocheck
"use client";

import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { useEffect, useState, useCallback } from "react";

interface ImageUploaderProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  label: string;
  name?: string;
  maxFiles?: number;
  disabled?: boolean;
}

interface ImagePreview {
  url: string;
  value: File | string;
  isNew: boolean;
}

const ImageUploader = ({
  control,
  errors,
  setValue,
  label,
  name = "images",
  maxFiles = 5,
  disabled = false,
}: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const watchedImages = useWatch({ control, name }) || [];

  useEffect(() => {
    const images = Array.isArray(watchedImages) ? watchedImages : [];
    const nextPreviews = images
      .filter((image): image is File | string => image instanceof File || typeof image === "string")
      .map((image) => {
        const isNew = image instanceof File;
        return {
          url: isNew ? URL.createObjectURL(image) : image,
          value: image,
          isNew,
        };
      });

    setPreviews(nextPreviews);
    return () => {
      nextPreviews.forEach((preview) => {
        if (preview.isNew) URL.revokeObjectURL(preview.url);
      });
    };
  }, [watchedImages]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (!files.length) return;

      const currentImages = Array.isArray(watchedImages) ? watchedImages : [];
      const remainingSlots = maxFiles - currentImages.length;
      if (remainingSlots <= 0) {
        alert(`Maximum ${maxFiles} files allowed.`);
        e.target.value = "";
        return;
      }
      const filesToAdd = files.slice(0, remainingSlots);

      if (filesToAdd.length < files.length) {
        alert(
          `Only ${remainingSlots} more files can be added. Maximum ${maxFiles} files allowed.`
        );
      }

      setValue(name, [...currentImages, ...filesToAdd], {
        shouldDirty: true,
        shouldValidate: true,
      });

      e.target.value = "";
    },
    [watchedImages, setValue, name, maxFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const currentImages = Array.isArray(watchedImages) ? watchedImages : [];
      setValue(
        name,
        currentImages.filter((_, imageIndex) => imageIndex !== index),
        { shouldDirty: true, shouldValidate: true }
      );
    },
    [watchedImages, setValue, name]
  );

  const canAddMore = previews.length < maxFiles;
  const errorMessage = name
    .split(".")
    .reduce((acc: any, part) => acc?.[part], errors)?.message as string;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {maxFiles > 1 && (
          <span className="text-gray-500 text-xs ml-1">
            ({previews.length}/{maxFiles})
          </span>
        )}
      </label>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {previews.map((preview, index) => (
            <div
              key={`${preview.url}-${index}`}
              className="relative group aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Image
                src={preview.url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>

              {/* File indicator */}
              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                {preview.isNew ? "New" : "Saved"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Input */}
      <Controller
        name={name}
        control={control}
        render={() => (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple={maxFiles > 1}
              onChange={handleFileUpload}
              disabled={disabled || !canAddMore}
              className="hidden"
              id={`file-input-${name}`}
            />
            <label
              htmlFor={`file-input-${name}`}
              className={`
                flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${
                  disabled || !canAddMore
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                }
              `}
            >
              <Upload
                size={24}
                className={
                  disabled || !canAddMore ? "text-gray-400" : "text-gray-500"
                }
              />
              <p
                className={`mt-2 text-sm ${
                  disabled || !canAddMore ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {!canAddMore
                  ? `Maximum ${maxFiles} files reached`
                  : "Click to upload images or drag and drop"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </label>
          </div>
        )}
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
