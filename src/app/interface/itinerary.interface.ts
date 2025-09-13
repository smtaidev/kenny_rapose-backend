export interface ICreateItinerary {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  goingWith: string;
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
  aiResponse: {
    itinerary_id: string;
    days: IDay[];
    status: string;
  };
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
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
  data: {
    itinerary_id: string;
    days: IDay[];
    status: string;
  };
  message?: string;
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
  selected_option: number;
  alternative_options: Array<{
    option: number;
    time: string;
    title: string;
    description: string;
    place: string;
    keyword: string;
  }>;
}
