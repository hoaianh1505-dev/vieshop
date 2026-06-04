import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9-_]/g, '-');
    callback(null, `${Date.now()}-${basename}${extension}`);
  },
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Only JPEG, PNG and WEBP images are allowed'));
    }
    callback(null, true);
  },
});
