import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../utils/fileUpload";

// Define LikeType since we're not importing it from Prisma
export type LikeType = "LIKE" | "DISLIKE";

export const LikeTypeValues = {
  LIKE: "LIKE" as const,
  DISLIKE: "DISLIKE" as const,
} as const;

// Types for video data
export interface VideoData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  duration?: number;
  isPublished?: boolean;
}

// Extended interface for video creation with files
export interface CreateVideoData
  extends Omit<VideoData, "videoUrl" | "thumbnailUrl"> {
  videoFile?: Express.Multer.File;
  thumbnailFile?: Express.Multer.File;
}

export interface UploadedVideoData extends Omit<CreateVideoData, 'videoFile' | 'thumbnailFile'> {
  videoUrl: string;
  thumbnailUrl: string;
  videoPublicId?: string | null;
  thumbnailPublicId?: string | null;
}

export const uploadVideo = async (
  videoData: UploadedVideoData,
  userId: string
) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: videoData.categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  try {
    // Create the video in the database
    const video = await prisma.video.create({
      data: {
        title: videoData.title,
        description: videoData.description || '',
        url: videoData.videoUrl,
        thumbnail: videoData.thumbnailUrl || null,
        duration: videoData.duration || 0,
        isPublished: videoData.isPublished ?? false,
        category: videoData.categoryId ? { connect: { id: videoData.categoryId } } : undefined,
        user: { connect: { id: userId } },
        // Store public IDs as metadata if needed (you'll need to add these fields to your Prisma schema)
        // metadata: videoData.videoPublicId || videoData.thumbnailPublicId ? {
        //   create: {
        //     videoPublicId: videoData.videoPublicId,
        //     thumbnailPublicId: videoData.thumbnailPublicId
        //   }
        // } : undefined
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // Note: 'avatar' field doesn't exist in the User model
            // Consider adding it to your Prisma schema if needed
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return video;
  } catch (error) {
    console.error('Error creating video:', error);
    throw new AppError('Failed to create video', 500);
  }
};

/**
 * Toggles a like/dislike on a video
 * @param userId The ID of the user performing the action
 * @param videoId The ID of the video to like/dislike
 * @param actionType The type of action: 'like', 'dislike', or 'toggle' (default)
 * @returns Object containing the action performed and current like status
 */
export const toggleVideoLike = async (
  userId: string,
  videoId: string,
  actionType: "like" | "dislike" | "toggle" = "toggle"
) => {
  // Check if video exists
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  // Check if user already liked/disliked this video
  const existingLike = await prisma.videoLike.findFirst({
    where: {
      userId,
      videoId,
    },
  });

  // Determine the target type based on action
  let targetType: LikeType;
  if (actionType === "toggle") {
    // If no existing like, default to LIKE
    // If existing like is LIKE, change to DISLIKE
    // If existing like is DISLIKE, remove it
    if (!existingLike) {
      targetType = "LIKE";
    } else if (existingLike.type === "LIKE") {
      targetType = "DISLIKE";
    } else {
      // Remove dislike
      await prisma.videoLike.delete({
        where: { id: existingLike.id },
      });
      return {
        action: "removed",
        type: "DISLIKE",
        isLiked: false,
        isDisliked: false,
      };
    }
  } else {
    // Explicit like/dislike action
    targetType = actionType.toUpperCase() as LikeType;

    // If clicking the same button again, remove the like/dislike
    if (existingLike?.type === targetType) {
      await prisma.videoLike.delete({
        where: { id: existingLike.id },
      });
      return {
        action: "removed",
        type: targetType,
        isLiked: false,
        isDisliked: false,
      };
    }
  }

  if (!existingLike) {
    // Create new like/dislike
    await prisma.videoLike.create({
      data: {
        userId,
        videoId,
        type: targetType,
      },
    });
  } else {
    // Update existing like/dislike
    await prisma.videoLike.update({
      where: { id: existingLike.id },
      data: { type: targetType },
    });
  }

  // Get updated counts
  const counts = await getVideoLikeCounts(videoId);

  return {
    action: existingLike ? "updated" : "created",
    type: targetType,
    isLiked: targetType === "LIKE",
    isDisliked: targetType === "DISLIKE",
    counts,
  };
};

export const searchVideos = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  return getVideos(page, limit, { searchQuery: query });
};

export const getVideosByCategory = async (
  categoryId: string,
  page: number = 1,
  limit: number = 10
) => {
  return getVideos(page, limit, { categoryId });
};

export const getTrendingVideos = async (
  page: number = 1,
  limit: number = 10
) => {
  return getVideos(page, limit, { sortBy: "trending" });
};

export const getPopularVideos = async (
  page: number = 1,
  limit: number = 10
) => {
  return getVideos(page, limit, { sortBy: "popular" });
};

export const getVideoLikeStatus = async (userId: string, videoId: string) => {
  const like = await prisma.videoLike.findUnique({
    where: {
      videoId_userId: {
        videoId,
        userId,
      },
    },
  });

  return {
    isLiked: like?.type === "LIKE",
    isDisliked: like?.type === "DISLIKE",
    currentLike: like?.type || null,
  };
};

export const getVideoLikeCounts = async (videoId: string) => {
  const likes = await prisma.videoLike.count({
    where: {
      videoId,
      type: "LIKE",
    },
  });

  const dislikes = await prisma.videoLike.count({
    where: {
      videoId,
      type: "DISLIKE",
    },
  });

  return { likes, dislikes };
};

export const editVideoDetails = async (
  userId: string,
  videoId: string,
  title?: string,
  description?: string,
  categoryId?: string
) => {
  // Check if video exists and belongs to user
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  if (video.userId !== userId) {
    throw new AppError("You can only edit your own videos", 403);
  }

  // Check if category exists (if provided)
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  const updatedVideo = await prisma.video.update({
    where: { id: videoId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(categoryId && { categoryId }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      _count: {
        select: {
          likes: { where: { type: "LIKE" } },
          comments: true,
        },
      },
    },
  });

  return updatedVideo;
};

export const updateVideo = async (
  videoId: string,
  videoData: Partial<VideoData>,
  userId: string,
  thumbnailFile?: Express.Multer.File
) => {
  // If there's a new thumbnail file, upload it to Cloudinary
  if (thumbnailFile) {
    try {
      // Upload the new thumbnail to Cloudinary
      const uploadResult = await uploadFileToCloudinary(
        thumbnailFile,
        "thumbnail"
      );
      videoData.thumbnailUrl = uploadResult.url;

      // Get the old thumbnail URL to delete it from Cloudinary
      const oldVideo = await prisma.video.findUnique({
        where: { id: videoId },
        select: { thumbnail: true },
      });

      // Delete the old thumbnail from Cloudinary if it exists
      if (oldVideo?.thumbnail) {
        const publicId = oldVideo.thumbnail.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteFileFromCloudinary(publicId).catch(console.error);
        }
      }
    } catch (error) {
      console.error("Error updating thumbnail:", error);
      throw new AppError("Failed to update thumbnail", 500);
    }
  }
  // Check if video exists and belongs to user
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  if (video.userId !== userId) {
    throw new AppError("You can only edit your own videos", 403);
  }

  // Check if category exists (if provided)
  if (videoData.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: videoData.categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  const updatedVideo = await prisma.video.update({
    where: { id: videoId },
    data: {
      ...videoData,
      userId,
      duration: videoData.duration || 0,
      views: 0,
      isPublished:
        videoData.isPublished !== undefined ? videoData.isPublished : true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      _count: {
        select: {
          likes: { where: { type: "LIKE" } },
          comments: true,
        },
      },
    },
  });

  return updatedVideo;
};

export const deleteVideo = async (userId: string, videoId: string) => {
  // Check if video exists and belongs to user
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  if (video.userId !== userId) {
    throw new AppError("You can only delete your own videos", 403);
  }

  // Delete video (this will cascade delete related records due to foreign key constraints)
  await prisma.video.delete({
    where: { id: videoId },
  });

  return { message: "Video deleted successfully" };
};

export const getUserVideos = async (userId: string) => {
  const videos = await prisma.video.findMany({
    where: { userId },
    include: {
      category: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return videos;
};

export const getVideos = async (
  page: number = 1,
  limit: number = 10,
  filters: { categoryId?: string; searchQuery?: string; sortBy?: string } = {}
) => {
  const { categoryId, searchQuery, sortBy = "newest" } = filters;

  // Build the where clause
  const where: any = {
    isPublished: true,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Build the orderBy clause
  let orderBy: any = { createdAt: "desc" };

  if (sortBy === "popular") {
    orderBy = { views: "desc" };
  } else if (sortBy === "trending") {
    orderBy = [{ views: "desc" }, { createdAt: "desc" }];
  }

  const skip = (page - 1) * limit;

  // Get videos with pagination
  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        _count: {
          select: {
            likes: {
              where: { type: "LIKE" },
            },
            comments: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy,
    }),
    prisma.video.count({ where }),
  ]);

  // Return videos and total count for pagination
  return {
    videos,
    total,
  };
};
