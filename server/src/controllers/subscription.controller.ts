import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import * as SubscriptionService from "../services/subscriptionService";
import { catchAsync } from "../utils/catchAsync";

export const toggleSubscription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { subscribedToId } = req.params;

  if (!userId || !subscribedToId) {
    throw new Error("User ID and subscribedTo ID are required");
  }

  const result = await SubscriptionService.toggleSubscription(userId, subscribedToId);
  
  res.status(200).json(result);
});

export const getSubscriptionStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { subscribedToId } = req.params;

  if (!userId || !subscribedToId) {
    throw new Error("User ID and subscribedTo ID are required");
  }

  const result = await SubscriptionService.getSubscriptionStatus(userId, subscribedToId);
  
  res.status(200).json(result);
});

export const getUserSubscriptions = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new Error("User ID is required");
  }

  const subscriptions = await SubscriptionService.getUserSubscriptions(userId);
  
  res.status(200).json({
    status: "success",
    data: {
      subscriptions
    }
  });
});

export const getUserSubscribers = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new Error("User ID is required");
  }

  const subscribers = await SubscriptionService.getUserSubscribers(userId);
  
  res.status(200).json({
    status: "success",
    data: {
      subscribers
    }
  });
});

export const getSubscriberCount = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  
  if (!userId) {
    throw new Error("User ID is required");
  }

  const result = await SubscriptionService.getSubscriberCount(userId);
  
  res.status(200).json({
    status: "success",
    data: result
  });
});
