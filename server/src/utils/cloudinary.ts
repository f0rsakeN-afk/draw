import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Promisify the upload_stream method
const uploadStream = (
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result)
          return reject(new Error("Upload failed: No result from Cloudinary"));
        resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: "videos" | "thumbnails",
  options: UploadApiOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const result = await uploadStream(fileBuffer, {
      folder: `vizion/${folder}`,
      resource_type: folder === "videos" ? "video" : "image",
      ...options,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type || "",
      format: result.format || "",
      bytes: result.bytes || 0,
      width: result.width,
      height: result.height,
      duration: result.duration,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

export const extractPublicId = (url: string): string | null => {
  const matches = url.match(/upload\/(?:v\d+\/)?([^/.]+)(?:\.[^/.]*)?$/);
  return matches ? matches[1] : null;
};

export default cloudinary;
