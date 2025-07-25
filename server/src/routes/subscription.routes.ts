import { Router } from "express";
import {
  toggleSubscription,
  getSubscriptionStatus,
  getUserSubscriptions,
  getUserSubscribers,
  getSubscriberCount
} from "../controllers/subscription.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All subscription routes require authentication
router.use(protect);

// Toggle subscription (subscribe/unsubscribe)
router.post("/:subscribedToId/toggle", toggleSubscription);

// Get subscription status
router.get("/:subscribedToId/status", getSubscriptionStatus);

// Get user's subscriptions
router.get("/my-subscriptions", getUserSubscriptions);

// Get user's subscribers
router.get("/my-subscribers", getUserSubscribers);

// Get subscriber count for a user
router.get("/:userId/count", getSubscriberCount);

export default router;
