import { Router } from "express";
import * as CommentController from "../controllers/comment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All comment routes require authentication
router.use(protect);

// Create a new comment or reply
router.post("/", CommentController.createComment);

// Get comments for a video
router.get("/video/:videoId", CommentController.getVideoComments);

// Comment interactions - New unified like/dislike endpoint
router.post("/:commentId/toggle-like", CommentController.toggleCommentLike);

// Deprecated endpoints (kept for backward compatibility)
router.post("/:commentId/like", CommentController.likeComment);
router.post("/:commentId/dislike", CommentController.dislikeComment);

// Delete a comment
router.delete("/:commentId", CommentController.deleteComment);

export default router;
