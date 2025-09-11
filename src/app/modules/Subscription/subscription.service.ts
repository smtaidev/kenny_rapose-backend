import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ISubscribeRequest, ISubscribeResponse, IGetAllSubscriptionsResponse } from "./subscription.interface";

//=====================Subscribe Email=====================
const subscribe = async (data: ISubscribeRequest): Promise<ISubscribeResponse> => {
  const { email } = data;

  // Check if email is already subscribed
  const existingSubscription = await prisma.subscription.findUnique({
    where: { email },
  });

  if (existingSubscription) {
    throw new AppError(httpStatus.CONFLICT, "This email is already subscribed");
  }

  // Create new subscription
  const subscription = await prisma.subscription.create({
    data: { email },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return {
    message: "Email subscribed successfully",
    subscription,
  };
};

//=====================Get All Subscriptions (Admin Only)=====================
const getAllSubscriptions = async (): Promise<IGetAllSubscriptionsResponse> => {
  const subscriptions = await prisma.subscription.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    subscriptions,
    totalSubscriptions: subscriptions.length,
  };
};

export const SubscriptionService = {
  subscribe,
  getAllSubscriptions,
};
