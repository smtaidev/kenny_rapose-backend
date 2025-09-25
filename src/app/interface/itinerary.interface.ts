export interface ICreateItinerary {
  total_adults: number;
  total_children: number;
  destination: string;
  location: string;
  departure_date: string;
  return_date: string;
  amenities: string[];
  activities: string[];
  pacing: string[];
  food: string[];
  special_note: string;
}

export interface IActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  place: string;
  keyword: string;
}

export interface IDay {
  day_number: number;
  date: string;
  activities: IActivity[];
}

export interface IItineraryResponse {
  id: string;
  itinerary_id: string;
  days: IDay[];
  status: "PENDING" | "COMPLETED" | "FAILED";
  userInfo: {
    total_adults: number;
    total_children: number;
    destination: string;
    location: string;
    departure_date: string;
    return_date: string;
    amenities: string[];
    activities: string[];
    pacing: string[];
    food: string[];
    special_note: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIRequest {
  total_adults: number;
  total_children: number;
  destination: string;
  location: string;
  departure_date: string;
  return_date: string;
  amenities: string[];
  activities: string[];
  pacing: string[];
  food: string[];
  special_note: string;
}

export interface IAIResponse {
  success: boolean;
  message: string;
  data: {
    itinerary_id: string;
    days: IDay[];
    status: string;
  };
}

export interface IEditActivityRequest {
  itinerary_id: string;
  activity_id: string;
  user_change: string;
}

export interface IEditAIRequest {
  current_activity: IActivity;
  user_change: string;
  day_plan: IActivity[];
  user_info: {
    total_adults: number;
    total_children: number;
    destination: string;
    location: string;
    departure_date: string;
    return_date: string;
    amenities: string[];
    activities: string[];
    pacing: string[];
    food: string[];
    special_note: string;
  };
}

export interface IEditAIResponse {
  success: boolean;
  data: {
    updated_activity: IActivity;
    alternative_options: Array<{
      option: number;
      time: string;
      title: string;
      description: string;
      place: string;
      keyword: string;
    }>;
  };
  message?: string;
}

export interface IUpdateActivityRequest {
  itinerary_id: string;
  activity_id: string;
  day_uuid: string;
  activity: {
    time: string;
    title: string;
    description: string;
    place: string;
    keyword: string;
  };
}

export interface IAddActivityRequest {
  itinerary_id: string;
  day_uuid: string;
  activity: {
    time: string;
    title: string;
    description: string;
    place: string;
    keyword: string;
  };
}
