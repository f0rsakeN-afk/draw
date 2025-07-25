import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";

type CommentData = {
  content: string;
  userId: string;
  videoId: string;
  parentId?: string;
};

export const createComment = async (data: CommentData) => {
  // Check if video exists
  const video = await prisma.video.findUnique({
    where: { id: data.videoId },
  });
  if (!video) {
    throw new AppError("Video not found", 404);
  }

  // If it's a reply, check if parent comment exists
  if (data.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: data.parentId },
    });
    if (!parentComment) {
      throw new AppError("Parent comment not found", 404);
    }
  }

  return prisma.comment.create({
    data: {
      content: data.content,
      userId: data.userId,
      videoId: data.videoId,
      parentId: data.parentId || undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });
};

export const getVideoComments = async (videoId: string, parentId?: string) => {
  return prisma.comment.findMany({
    where: {
      videoId,
      parentId: parentId || null, // If parentId is not provided, get top-level comments
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        },
      },
      _count: {
        select: {
          likes: {
            where: { type: 'LIKE' },
          },
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Toggles a like/dislike on a comment
 * @param userId The ID of the user performing the action
 * @param commentId The ID of the comment to like/dislike
 * @param actionType The type of action: 'like', 'dislike', or 'toggle' (default)
 * @returns Object containing the action performed and current like status
 */
export const toggleCommentLike = async (
  userId: string, 
  commentId: string, 
  actionType: 'like' | 'dislike' | 'toggle' = 'toggle'
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  // Check if user already liked/disliked this comment
  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  // Determine the target type based on action
  let targetType: 'LIKE' | 'DISLIKE';
  if (actionType === 'toggle') {
    // If no existing like, default to LIKE
    // If existing like is LIKE, change to DISLIKE
    // If existing like is DISLIKE, remove it
    if (!existingLike) {
      targetType = 'LIKE';
    } else if (existingLike.type === 'LIKE') {
      targetType = 'DISLIKE';
    } else {
      // Remove dislike
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { 
        action: 'removed',
        type: 'DISLIKE',
        isLiked: false,
        isDisliked: false
      };
    }
  } else {
    // Explicit like/dislike action
    targetType = actionType.toUpperCase() as 'LIKE' | 'DISLIKE';
    
    // If clicking the same button again, remove the like/dislike
    if (existingLike?.type === targetType) {
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { 
        action: 'removed',
        type: targetType,
        isLiked: false,
        isDisliked: false
      };
    } else {
      targetType = targetType; // Keep the target type as is
    }
  }

  if (!existingLike) {
    // Create new like/dislike
    await prisma.commentLike.create({
      data: {
        userId,
        commentId,
        type: targetType,
      },
    });
  } else {
    // Update existing like/dislike
    await prisma.commentLike.update({
      where: {
        id: existingLike.id,
      },
      data: { type: targetType },
    });
  }

  // Get updated counts
  const likes = await prisma.commentLike.count({
    where: { commentId, type: 'LIKE' },
  });

  const dislikes = await prisma.commentLike.count({
    where: { commentId, type: 'DISLIKE' },
  });
  
  return {
    action: existingLike ? 'updated' : 'created',
    type: targetType,
    isLiked: targetType === 'LIKE',
    isDisliked: targetType === 'DISLIKE',
    counts: { likes, dislikes }
  };
};

export const deleteComment = async (userId: string, commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  // Check if user is the owner of the comment
  if (comment.userId !== userId) {
    throw new AppError("Not authorized to delete this comment", 403);
  }

  // Delete comment and its replies (cascading delete is handled by Prisma)
  return prisma.comment.delete({
    where: { id: commentId },
  });
};
