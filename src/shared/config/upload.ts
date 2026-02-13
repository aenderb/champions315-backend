import multer from 'multer';

const storage = multer.memoryStorage();

/**
 * Multer com memoryStorage — arquivo fica em req.file.buffer
 * para ser enviado ao Cloudinary.
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Use JPEG, PNG ou WebP.'));
    }
  },
});
