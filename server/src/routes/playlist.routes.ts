import { Router } from "express";
import * as PlaylistController from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All playlist routes require authentication
router.use(protect);

// Create a new playlist
router.post("/", PlaylistController.createPlaylist);

// Get user's playlists
router.get("/my-playlists", PlaylistController.getUserPlaylists);

// Get playlist by ID (public or user's own)
router.get("/:playlistId", PlaylistController.getPlaylist);

// Update playlist
router.patch("/:playlistId", PlaylistController.updatePlaylist);

// Delete playlist
router.delete("/:playlistId", PlaylistController.deletePlaylist);

// Add video to playlist
router.post("/:playlistId/videos/:videoId", PlaylistController.addToPlaylist);

// Remove video from playlist
router.delete("/:playlistId/videos/:videoId", PlaylistController.removeFromPlaylist);

// Update video position in playlist
router.patch("/:playlistId/videos/:videoId/position", PlaylistController.updateVideoPosition);

export default router;
