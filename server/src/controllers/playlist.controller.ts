import { Request, Response, NextFunction } from "express";
import * as PlaylistService from "../services/playlistService";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../types/express";

export const createPlaylist = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { name, description, isPublic } = req.body;
  const userId = req.user.id;

  const playlist = await PlaylistService.createPlaylist(userId, name, description, isPublic);

  res.status(201).json({
    status: "success",
    data: {
      playlist,
    },
  });
});

export const getUserPlaylists = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const playlists = await PlaylistService.getUserPlaylists(userId);

  res.status(200).json({
    status: "success",
    results: playlists.length,
    data: {
      playlists,
    },
  });
});

export const getPlaylist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { playlistId } = req.params;
  const userId = req.user?.id; // Optional for public playlists

  const playlist = await PlaylistService.getPlaylistById(playlistId, userId);

  res.status(200).json({
    status: "success",
    data: {
      playlist,
    },
  });
});

export const updatePlaylist = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { playlistId } = req.params;
  const userId = req.user.id;
  const { name, description, isPublic } = req.body;

  const playlist = await PlaylistService.updatePlaylist(playlistId, userId, {
    name,
    description,
    isPublic,
  });

  res.status(200).json({
    status: "success",
    data: {
      playlist,
    },
  });
});

export const deletePlaylist = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { playlistId } = req.params;
  const userId = req.user.id;

  await PlaylistService.deletePlaylist(playlistId, userId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const addToPlaylist = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user.id;

  const playlistItem = await PlaylistService.addVideoToPlaylist(playlistId, videoId, userId);

  res.status(200).json({
    status: "success",
    data: {
      playlistItem,
    },
  });
});

export const removeFromPlaylist = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user.id;

  await PlaylistService.removeVideoFromPlaylist(playlistId, videoId, userId);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

export const updateVideoPosition = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { playlistId, videoId } = req.params;
  const { position } = req.body;
  const userId = req.user.id;

  if (typeof position !== 'number' || position < 0) {
    return next(new Error('Invalid position'));
  }

  const result = await PlaylistService.updateVideoPosition(playlistId, videoId, position, userId);

  res.status(200).json({
    status: "success",
    data: result,
  });
});
