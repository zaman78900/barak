import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import path from 'path';

const router = express.Router();

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
  },
});

// Helper to ensure bucket exists
async function ensureBucketExists(bucketName) {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;

    if (!buckets.find(b => b.name === bucketName)) {
      logger.info(`Creating missing storage bucket: ${bucketName}`);
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880
      });
      if (createError) throw createError;
    }
  } catch (err) {
    logger.error(`Error ensuring bucket exists: ${err.message}`);
    // Don't throw, might still work if it exists but list failed
  }
}

router.post('/', authenticate, authorize(['admin']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucketName = 'products';
    await ensureBucketExists(bucketName);

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExt}`;
    const filePath = `product-images/${fileName}`;

    logger.info(`Uploading file to Supabase: ${filePath}`);

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    logger.info(`File uploaded successfully: ${publicUrl}`);

    res.status(200).json({
      url: publicUrl,
      fileName: fileName,
      path: filePath
    });

  } catch (error) {
    logger.error(`Upload error: ${error.message}`);
    res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message 
    });
  }
});

export default router;
