import { Request, Response, NextFunction } from "express";
import * as CommentService from "../services/commentService";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../types/express";

export const createComment = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { content, videoId, parentId } = req.body;
  const userId = req.user.id;

  const comment = await CommentService.createComment({
    content,
    userId,
    videoId,
    parentId,
  });

  res.status(201).json({
    status: "success",
    data: {
      comment,
    },
  });
});

export const getVideoComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { videoId } = req.params;
  const { parentId } = req.query;

  const comments = await CommentService.getVideoComments(
    videoId,
    parentId as string | undefined
  );

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}/toggle-like:
 *   post:
 *     summary: Toggle like/dislike on a comment
 *     description: Toggles between like, dislike, or removes the reaction
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
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
export const toggleCommentLike = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const action = (req.query.action as 'like' | 'dislike' | 'toggle') || 'toggle';

  const result = await CommentService.toggleCommentLike(userId, commentId, action);

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * @deprecated Use POST /api/v1/comments/:commentId/toggle-like?action=like instead
 */
export const likeComment = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const result = await CommentService.toggleCommentLike(userId, commentId, 'like');

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * @deprecated Use POST /api/v1/comments/:commentId/toggle-like?action=dislike instead
 */
export const dislikeComment = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const result = await CommentService.toggleCommentLike(userId, commentId, 'dislike');

  res.status(200).json({
    status: "success",
    data: result
  });
});

export const deleteComment = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  await CommentService.deleteComment(userId, commentId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
