import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import * as VideoService from "../services/videoService";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import fs from 'fs';
import { uploadFile, uploadVideoWithThumbnail, processVideoUpload, deleteFileFromCloudinary } from "../utils/fileUpload";
import { LikeType, CreateVideoData, UploadedVideoData } from "../services/videoService";

// Extend Express Request type to include files
declare global {
  namespace Express {
    interface Request {
      files?:
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[]
        | undefined;
    }
  }
}

// Type guard to check if files is in the expected format
const hasField = (
  files: any,
  field: string
): files is { [key: string]: Express.Multer.File[] } => {
  return files && !Array.isArray(files) && field in files;
};

// Using the global Request type extension from src/types/express/index.d.ts

type AuthenticatedRequest = Request;

// Helper function to get pagination parameters from query
const getPaginationParams = (query: any) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  return { page, limit };
};

const { LIKE, DISLIKE } = VideoService.LikeTypeValues;

// Extend the Request type to include query parameters
type RequestWithQuery<T> = Request<{}, {}, {}, T>;

// Middleware for handling file uploads
export const handleFileUpload = (fieldName: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const upload = uploadFile(fieldName);
    upload(req, res, (err: any) => {
      if (err) {
        return next(
          new AppError(err.message || `Error uploading ${fieldName}`, 400)
        );
      }
      next();
    });
  };
};

// Upload a new video with thumbnail
export const createVideo = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, description, categoryId, duration, isPublished } = req.body;
    
    if (!req.files) {
      return next(new AppError('Please provide both video and thumbnail files', 400));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Validate required files
    if (!files.video?.[0] || !files.thumbnail?.[0]) {
      return next(new AppError('Both video and thumbnail files are required', 400));
    }

    try {
      // Process and upload files
      const uploadResult = await processVideoUpload({
        video: files.video,
        thumbnail: files.thumbnail
      });

      // Create video data for the service
      const videoData: UploadedVideoData = {
        title,
        description: description || '',
        categoryId,
        duration: parseInt(duration) || 0,
        isPublished: isPublished === 'true',
        videoUrl: uploadResult.videoUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        videoPublicId: uploadResult.videoPublicId || undefined,
        thumbnailPublicId: uploadResult.thumbnailPublicId || undefined
      };

      // Create the video in the database
      const video = await VideoService.uploadVideo(videoData, req.user!.id);

      res.status(201).json({
        status: 'success',
        data: {
          video
        }
      });
    } catch (error) {
      console.error('Error in createVideo:', error);
      
      // Clean up any uploaded files if an error occurs
      if (files.video?.[0]?.path) {
        try {
          await fs.promises.unlink(files.video[0].path);
        } catch (cleanupError) {
          console.error('Error cleaning up video file:', cleanupError);
        }
      }
      
      if (files.thumbnail?.[0]?.path) {
        try {
          await fs.promises.unlink(files.thumbnail[0].path);
        } catch (cleanupError) {
          console.error('Error cleaning up thumbnail file:', cleanupError);
        }
      }
      
      next(error);
    }
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    // Check if required fields are present
    if (!title || !categoryId) {
      return next(new AppError("Title and category are required", 400));
    }

    // Check if files exist and are in the expected format
    if (!req.files || !hasField(req.files, "video") || !req.files.video?.[0]) {
      return next(new AppError("Video file is required", 400));
    }

    // Upload files first
    const uploadResult = await processVideoUpload({
      video: req.files.video,
      thumbnail: hasField(req.files, "thumbnail") ? req.files.thumbnail : undefined
    });

    // Prepare video data with uploaded file URLs
    const videoData: UploadedVideoData = {
      title,
      description: description || "",
      categoryId,
      duration: duration ? parseInt(duration) : 0,
      isPublished: isPublished ? isPublished === "true" : true,
      videoUrl: uploadResult.videoUrl,
      thumbnailUrl: uploadResult.thumbnailUrl,
      videoPublicId: uploadResult.videoPublicId,
      thumbnailPublicId: uploadResult.thumbnailPublicId
    };

    const video = await VideoService.uploadVideo(videoData, userId);

    res.status(201).json({
      status: "success",
      data: {
        video,
      },
    });
  }
);

// Like a video
/**
 * @swagger
 * /api/v1/videos/{videoId}/toggle-like:
 *   post:
 *     summary: Toggle like/dislike on a video
 *     description: Toggles between like, dislike, or removes the reaction
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [like, dislike, toggle]
 *           default: toggle
 *         description: Action to perform - like, dislike, or toggle
 *     responses:
 *       200:
 *         description: Successfully toggled like/dislike
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     action:
 *                       type: string
 *                       enum: [created, updated, removed]
 *                     type:
 *                       type: string
 *                       enum: [LIKE, DISLIKE]
 *                     isLiked:
 *                       type: boolean
 *                     isDisliked:
 *                       type: boolean
 *                     counts:
 *                       type: object
 *                       properties:
 *                         likes:
 *                           type: number
 *                         dislikes:
 *                           type: number
 */
export const toggleVideoLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params as { videoId: string };
    const userId = req.user?.id;
    const action =
      (req.query.action as "like" | "dislike" | "toggle") || "toggle";

    if (!userId) {
      return next(
        new AppError("You must be logged in to react to a video", 401)
      );
    }

    const result = await VideoService.toggleVideoLike(userId, videoId, action);

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);

/**
 * @deprecated Use POST /api/v1/videos/:videoId/toggle-like?action=like instead
 */
export const likeVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params as { videoId: string };
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("You must be logged in to like a video", 401));
    }

    const result = await VideoService.toggleVideoLike(userId, videoId, "like");

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);

/**
 * @deprecated Use POST /api/v1/videos/:videoId/toggle-like?action=dislike instead
 */
export const dislikeVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params as { videoId: string };
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new AppError("You must be logged in to dislike a video", 401)
      );
    }

    const result = await VideoService.toggleVideoLike(
      userId,
      videoId,
      "dislike"
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);

export const getVideoLikeStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params as { videoId: string };
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new AppError("You must be logged in to check like status", 401)
      );
    }

    const like = await VideoService.getVideoLikeStatus(userId, videoId);

    res.status(200).json({
      status: "success",
      data: like,
    });
  }
);

export const getVideoLikeCounts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params as { videoId: string };

    const counts = await VideoService.getVideoLikeCounts(videoId);

    res.status(200).json({
      status: "success",
      data: counts,
    });
  }
);

export const updateVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;
    const thumbnailFile = req.file;

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const video = await VideoService.updateVideo(
      id,
      updateData,
      userId,
      thumbnailFile
    );

    res.status(200).json({
      status: "success",
      data: {
        video,
      },
    });
  }
);

export const deleteVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { videoId } = req.params;

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const result = await VideoService.deleteVideo(userId, videoId);

    res.status(200).json(result);
  }
);

export const getUserVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const videos = await VideoService.getUserVideos(userId);

    res.status(200).json({
      message: "Videos retrieved successfully",
      videos,
    });
  }
);

// Get video by ID
export const getVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: true,
        _count: {
          select: {
            likes: { where: { type: "LIKE" } },
            comments: true,
          },
        },
      },
    });

    if (!video) {
      return next(new AppError("Video not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { video },
    });
  }
);

// Define the shape of the video service response
interface VideoServiceResponse {
  videos: any[];
  total: number;
}

// Get videos with filters
export const getVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = "1",
      limit = "10",
      categoryId,
      search: searchQuery,
      sortBy = "newest",
    } = req.query as {
      page?: string;
      limit?: string;
      categoryId?: string;
      search?: string;
      sortBy?: string;
    };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const totalCount = await prisma.video.count({
      where: {
        isPublished: true,
        ...(categoryId ? { categoryId } : {}),
        ...(searchQuery
          ? {
              OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    });

    const videos = await prisma.video.findMany({
      where: {
        isPublished: true,
        ...(categoryId ? { categoryId } : {}),
        ...(searchQuery
          ? {
              OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: true,
        _count: {
          select: {
            likes: { where: { type: "LIKE" } },
            comments: true,
          },
        },
      },
      orderBy:
        sortBy === "popular"
          ? { views: "desc" }
          : sortBy === "trending"
          ? [{ views: "desc" }, { createdAt: "desc" }]
          : { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalVideos: totalCount,
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
    };

    res.status(200).json({
      status: "success",
      results: videos.length,
      pagination,
      data: { videos },
    });
  }
);

// Search videos by query
export const searchVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      q: searchQuery,
      page = "1",
      limit = "10",
    } = req.query as { q?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    if (!searchQuery) {
      return next(new AppError("Search query is required", 400));
    }

    const totalCount = await prisma.video.count({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
    });

    const videos = await prisma.video.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: true,
        _count: {
          select: {
            likes: { where: { type: "LIKE" } },
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalVideos: totalCount,
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
    };

    res.status(200).json({
      status: "success",
      results: videos.length,
      pagination,
      data: { videos },
    });
  }
);

// Get videos by category
export const getVideosByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params as { categoryId: string };
    const { page = "1", limit = "10" } = req.query as {
      page?: string;
      limit?: string;
    };
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    if (!categoryId) {
      return next(new AppError("Category ID is required", 400));
    }

    const totalCount = await prisma.video.count({
      where: {
        isPublished: true,
        categoryId,
      },
    });

    const videos = await prisma.video.findMany({
      where: {
        isPublished: true,
        categoryId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: true,
        _count: {
          select: {
            likes: { where: { type: "LIKE" } },
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalVideos: totalCount,
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
    };

    res.status(200).json({
      status: "success",
      results: videos.length,
      pagination,
      data: { videos },
    });
  }
);

// Get trending videos
export const getTrendingVideos = catchAsync(
  async (
    req: RequestWithQuery<{ page?: string; limit?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { page, limit } = getPaginationParams(req.query);

    const result = (await (VideoService as any).getTrendingVideos(
      page,
      limit
    )) as VideoServiceResponse;

    const { videos, total } = result;
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };

    res.status(200).json({
      status: "success",
      results: videos.length,
      pagination,
      data: {
        videos,
      },
    });
  }
);

// Get popular videos
export const getPopularVideos = catchAsync(
  async (
    req: RequestWithQuery<{ page?: string; limit?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { page, limit } = getPaginationParams(req.query);

    const result = (await (VideoService as any).getPopularVideos(
      page,
      limit
    )) as VideoServiceResponse;

    const { videos, total } = result;
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };

    res.status(200).json({
      status: "success",
      results: videos.length,
      pagination,
      data: {
        videos,
      },
    });
  }
);

// Get all videos with optional category filter
export const getAllVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = "1",
      limit = "10",
      categoryId,
    } = req.query as {
      page?: string;
      limit?: string;
      categoryId?: string;
    };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const where: any = { isPublished: true };
    if (categoryId) where.categoryId = categoryId;

    const totalCount = await prisma.video.count({ where });

    const videos = await prisma.video.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: true,
        _count: {
          select: {
            likes: { where: { type: "LIKE" } },
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalVideos: totalCount,
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
    };

    res.status(200).json({
      status: "success",
      results: videos.length,
      pagination,
      data: { videos },
    });
  }
);
