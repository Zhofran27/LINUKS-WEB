import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'laporan',
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // Batasi format
    };
  },
});

// 3. Inisialisasi multer dengan storage baru
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // batasi 10MB
});
