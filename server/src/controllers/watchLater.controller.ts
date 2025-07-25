import { Request, Response, NextFunction } from "express";
import * as WatchLaterService from "../services/watchLaterService";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../types/express";

export const addToWatchLater = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  const result = await WatchLaterService.addToWatchLater(userId, videoId);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const removeFromWatchLater = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  const result = await WatchLaterService.removeFromWatchLater(userId, videoId);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getWatchLater = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const watchLater = await WatchLaterService.getUserWatchLater(userId);

  res.status(200).json({
    status: "success",
    results: watchLater.length,
    data: {
      watchLater,
    },
  });
});

export const checkWatchLaterStatus = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  const result = await WatchLaterService.isInWatchLater(userId, videoId);

  res.status(200).json({
    status: "success",
    data: result,
  });
});
