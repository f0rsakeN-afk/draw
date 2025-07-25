import { Router } from "express";
import * as WatchLaterController from "../controllers/watchLater.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All watch later routes require authentication
router.use(protect);

// Add video to watch later
router.post("/:videoId", WatchLaterController.addToWatchLater);

// Remove video from watch later
router.delete("/:videoId", WatchLaterController.removeFromWatchLater);

// Get user's watch later list
router.get("/", WatchLaterController.getWatchLater);

// Check if video is in watch later
router.get("/status/:videoId", WatchLaterController.checkWatchLaterStatus);

export default router;
