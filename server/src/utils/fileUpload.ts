import multer from 'multer';
import { Request } from 'express';
import { deleteFromCloudinary as cloudinaryDelete, uploadToCloudinary as cloudinaryUpload, extractPublicId } from './cloudinary';

// In-memory storage for multer
const storage = multer.memoryStorage();

// File filter to allow both image and video files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, JPG, WebP) and videos (MP4, WebM, QuickTime) are allowed.'));
  }
};

// Initialize multer with memory storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

// Middleware for uploading a single file (thumbnail or video)
export const uploadFile = (fieldName: string) => upload.single(fieldName);

// Middleware specifically for thumbnail upload
export const uploadThumbnail = uploadFile('thumbnail');

// Middleware specifically for video upload
export const uploadVideo = uploadFile('video');

// Upload a file to Cloudinary
export const uploadFileToCloudinary = async (
  file: Express.Multer.File,
  type: 'video' | 'thumbnail'
) => {
  if (!file.buffer) {
    throw new Error('No file buffer provided');
  }

  return await cloudinaryUpload(file.buffer, type === 'video' ? 'videos' : 'thumbnails', {
    filename_override: file.originalname,
    resource_type: type === 'video' ? 'video' : 'image',
  });
};

// Delete a file from Cloudinary
export const deleteFileFromCloudinary = async (url: string, type: 'video' | 'thumbnail' = 'thumbnail') => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    throw new Error('Invalid Cloudinary URL');
  }
  
  await cloudinaryDelete(publicId, type === 'video' ? 'video' : 'image');
};

// Delete a thumbnail from Cloudinary
export const deleteThumbnail = async (url: string): Promise<void> => {
  return deleteFileFromCloudinary(url, 'thumbnail');
};

// Delete a video from Cloudinary
export const deleteVideo = async (url: string): Promise<void> => {
  return deleteFileFromCloudinary(url, 'video');
};
