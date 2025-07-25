import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const toggleSubscription = async (subscriberId: string, subscribedToId: string) => {
  if (subscriberId === subscribedToId) {
    throw new AppError("You cannot subscribe to yourself", 400);
  }

  // Check if user exists
  const userToSubscribe = await prisma.user.findUnique({
    where: { id: subscribedToId }
  });

  if (!userToSubscribe) {
    throw new AppError("User not found", 404);
  }

  // Check if already subscribed
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      subscriberId_subscribedToId: {
        subscriberId,
        subscribedToId
      }
    }
  });

  if (existingSubscription) {
    // Unsubscribe
    await prisma.subscription.delete({
      where: {
        subscriberId_subscribedToId: {
          subscriberId,
          subscribedToId
        }
      }
    });
    return { message: "Unsubscribed successfully", isSubscribed: false };
  } else {
    // Subscribe
    await prisma.subscription.create({
      data: {
        subscriberId,
        subscribedToId
      }
    });
    return { message: "Subscribed successfully", isSubscribed: true };
  }
};

export const getSubscriptionStatus = async (subscriberId: string, subscribedToId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      subscriberId_subscribedToId: {
        subscriberId,
        subscribedToId
      }
    }
  });

  return { isSubscribed: !!subscription };
};

export const getUserSubscriptions = async (userId: string) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { subscriberId: userId },
    include: {
      subscribedTo: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return subscriptions;
};

export const getUserSubscribers = async (userId: string) => {
  const subscribers = await prisma.subscription.findMany({
    where: { subscribedToId: userId },
    include: {
      subscriber: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return subscribers;
};

export const getSubscriberCount = async (userId: string) => {
  const count = await prisma.subscription.count({
    where: { subscribedToId: userId }
  });

  return { subscriberCount: count };
};
