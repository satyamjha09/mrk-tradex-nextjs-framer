import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

type CloudinaryUploadResult = {
  url: string;
  public_id: string;
};

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

const getLocalUploadBaseUrl = () =>
  process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;

const extensionForMimeType = (mimeType: string) => {
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
  };
  return extensions[mimeType] || ".jpg";
};

const uploadToLocalStorage = async (
  files: Express.Multer.File[],
): Promise<CloudinaryUploadResult[]> => {
  const uploadDir = path.join(process.cwd(), "uploads", "products");
  await fs.mkdir(uploadDir, { recursive: true });

  return Promise.all(
    files.map(async (file) => {
      const filename = `${Date.now()}-${crypto.randomUUID()}${extensionForMimeType(
        file.mimetype,
      )}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, file.buffer);

      return {
        url: `${getLocalUploadBaseUrl()}/uploads/products/${filename}`,
        public_id: `local/products/${filename}`,
      };
    }),
  );
};

export const uploadToCloudinary = async (
  files: Express.Multer.File[],
): Promise<CloudinaryUploadResult[]> => {
  if (!hasCloudinaryConfig()) {
    return uploadToLocalStorage(files);
  }

  const uploadPromises = files.map(
    (file) =>
      new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              fetch_format: "webp",
              quality: "auto",
              flags: "progressive",
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result?.secure_url || !result.public_id) {
                return reject(new Error("Cloudinary upload failed"));
              }
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            },
          )
          .end(file.buffer);
      }),
  );

  return Promise.all(uploadPromises);
};
