// @ts-nocheck
"use client";

import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
  RegisterOptions,
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
  rules?: RegisterOptions;
}

interface ImagePreview {
  url: string;
  value: File | string;
  isNew: boolean;
}

const MAX_SOURCE_FILE_SIZE = 10 * 1024 * 1024;
const COMPRESS_ABOVE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;

const getCompressedFileName = (fileName: string) => {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "image";
  return `${baseName}.webp`;
};

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to read selected image"));
    image.src = url;
  });

const compressImageFile = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a supported image file.`);
  }

  if (file.size > MAX_SOURCE_FILE_SIZE) {
    throw new Error(`${file.name} is larger than 10MB.`);
  }

  if (file.type === "image/gif" || file.size <= COMPRESS_ABOVE_SIZE) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY);
    });

    if (!blob || blob.size >= file.size) return file;

    return new File([blob], getCompressedFileName(file.name), {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const ImageUploader = ({
  control,
  errors,
  setValue,
  label,
  name = "images",
  maxFiles = 5,
  disabled = false,
  rules,
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
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      let preparedFiles: File[];
      try {
        preparedFiles = await Promise.all(filesToAdd.map(compressImageFile));
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "One or more selected images could not be prepared.",
        );
        e.target.value = "";
        return;
      }

      setValue(name, [...currentImages, ...preparedFiles], {
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
        rules={rules}
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
                PNG, JPG, GIF, WEBP up to 10MB each. Large images are optimized
                before upload.
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
