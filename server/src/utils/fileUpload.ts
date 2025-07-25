import multer from 'multer';
import { Request } from 'express';
import { 
  deleteFromCloudinary as cloudinaryDelete, 
  uploadToCloudinary as cloudinaryUpload, 
  extractPublicId,
  type CloudinaryUploadResult
} from './cloudinary';

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
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
});

// Middleware for uploading a single file (thumbnail or video)
export const uploadFile = (fieldName: string) => upload.single(fieldName);

// Middleware for uploading multiple files
export const uploadFiles = (fields: Array<{ name: string; maxCount?: number }>) => 
  upload.fields(fields);

// Middleware specifically for video upload
export const uploadVideo = uploadFile('video');

// Middleware specifically for thumbnail upload
export const uploadThumbnail = uploadFile('thumbnail');

// Middleware for uploading both video and thumbnail
export const uploadVideoWithThumbnail = uploadFiles([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

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

/**
 * Process and upload video and thumbnail files
 */
interface ProcessVideoUploadResult {
  videoUrl: string;
  thumbnailUrl: string;
  videoPublicId: string;
  thumbnailPublicId: string;
}

export const processVideoUpload = async (files: {
  video?: Express.Multer.File[];
  thumbnail?: Express.Multer.File[];
}): Promise<ProcessVideoUploadResult> => {
  if (!files.video?.[0]) {
    throw new Error('Video file is required');
  }
  if (!files.thumbnail?.[0]) {
    throw new Error('Thumbnail file is required');
  }

  try {
    const [videoUpload, thumbnailUpload] = await Promise.all([
      uploadFileToCloudinary(files.video[0], 'video'),
      uploadFileToCloudinary(files.thumbnail[0], 'thumbnail')
    ]);

    return {
      videoUrl: videoUpload.url,
      thumbnailUrl: thumbnailUpload.url,
      videoPublicId: videoUpload.public_id,
      thumbnailPublicId: thumbnailUpload.public_id
    };
  } catch (error) {
    console.error('Error uploading files to Cloudinary:', error);
    throw new Error('Failed to upload files');
  }
};
