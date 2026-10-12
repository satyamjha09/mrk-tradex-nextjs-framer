import multer from "multer";

const MAX_UPLOAD_FILES_PER_REQUEST = 16;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: MAX_UPLOAD_FILES_PER_REQUEST, // Each product variant is still capped at 4 images in product validation.
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
