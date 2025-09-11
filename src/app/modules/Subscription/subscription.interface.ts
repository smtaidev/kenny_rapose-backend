export interface ISubscribeRequest {
  email: string;
}

export interface ISubscribeResponse {
  message: string;
  subscription: {
    id: string;
    email: string;
    createdAt: Date;
  };
}

export interface IGetAllSubscriptionsResponse {
  subscriptions: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  totalSubscriptions: number;
}
