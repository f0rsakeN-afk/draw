import { Router } from "express";
import * as videoController from "../controllers/video.controller";
import { protect } from "../middlewares/auth.middleware";
import { uploadVideoWithThumbnail } from "../utils/fileUpload";

const router = Router();

// Public routes
router.get("/", videoController.getVideos);
router.get("/search/:query", videoController.searchVideos);
router.get("/category/:categoryId", videoController.getVideosByCategory);
router.get("/trending", videoController.getTrendingVideos);
router.get("/popular", videoController.getPopularVideos);
router.get("/:id", videoController.getVideo);

// Protected routes (require authentication)
router.use(protect);

// Video CRUD operations
router.post("/", protect, uploadVideoWithThumbnail, videoController.createVideo);
router.put(
  "/:id", 
  protect, 
  uploadVideoWithThumbnail, 
  videoController.updateVideo
);
router.delete("/:id", videoController.deleteVideo);

// Video interactions - New unified like/dislike endpoint
router.post("/:videoId/toggle-like", videoController.toggleVideoLike);

// Deprecated endpoints (kept for backward compatibility)
router.post("/:videoId/like", videoController.likeVideo);
router.post("/:videoId/dislike", videoController.dislikeVideo);

// Like status and counts
router.get("/:videoId/like-status", videoController.getVideoLikeStatus);
router.get("/:videoId/likes", videoController.getVideoLikeCounts);

// User videos
router.get("/user/videos", videoController.getUserVideos);

export default router;
