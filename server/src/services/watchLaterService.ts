import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const addToWatchLater = async (userId: string, videoId: string) => {
  // Check if video exists
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });
  
  if (!video) {
    throw new AppError("Video not found", 404);
  }

  // Check if already in watch later
  const existing = await prisma.watchLater.findFirst({
    where: {
      userId,
      videoId,
    },
  });

  if (existing) {
    return { message: "Already in watch later" };
  }

  // Add to watch later
  await prisma.watchLater.create({
    data: {
      userId,
      videoId,
    },
  });

  return { message: "Added to watch later" };
};

export const removeFromWatchLater = async (userId: string, videoId: string) => {
  const watchLater = await prisma.watchLater.findFirst({
    where: {
      userId,
      videoId,
    },
  });

  if (!watchLater) {
    throw new AppError("Video not found in watch later", 404);
  }

  await prisma.watchLater.delete({
    where: {
      id: watchLater.id,
    },
  });

  return { message: "Removed from watch later" };
};

export const getUserWatchLater = async (userId: string) => {
  return prisma.watchLater.findMany({
    where: { userId },
    include: {
      video: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              likes: {
                where: { type: 'LIKE' },
              },
              comments: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
};

export const isInWatchLater = async (userId: string, videoId: string) => {
  const watchLater = await prisma.watchLater.findFirst({
    where: {
      userId,
      videoId,
    },
  });

  return { isInWatchLater: !!watchLater };
};
