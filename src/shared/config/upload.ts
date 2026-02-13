import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

const uploadsFolder = path.resolve(process.cwd(), 'uploads', 'avatars');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsFolder);
  },
  filename: (_req, file, cb) => {
    const hash = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${hash}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

export const uploadAvatar = multer({
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

export { uploadsFolder };
