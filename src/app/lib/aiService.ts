import axios from 'axios';
import { IAIRequest, IAIResponse, IEditAIRequest, IEditAIResponse } from '../interface/itinerary.interface';

const AI_ENDPOINT = 'http://206.162.244.131:9074/ai_suggestion';
const AI_EDIT_ENDPOINT = 'http://206.162.244.131:9074/ai_edit_suggestion';

export const callAIEndpoint = async (data: IAIRequest): Promise<IAIResponse> => {
  try {
    const response = await axios.post(AI_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return {
      success: true,
      data: response.data,
      message: 'AI response received successfully',
    };
  } catch (error: any) {
    console.error('AI endpoint error:', error);
    
    return {
      success: false,
      data: {
        itinerary_id: 'error',
        days: [],
        status: 'FAILED',
      },
      message: error.response?.data?.message || 'Failed to get AI response',
    };
  }
};

export const callAIEditEndpoint = async (data: IEditAIRequest): Promise<IEditAIResponse> => {
  try {
    const response = await axios.post(AI_EDIT_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return {
      success: true,
      data: response.data,
      message: 'AI edit response received successfully',
    };
  } catch (error: any) {
    console.error('AI edit endpoint error:', error);
    return {
      success: false,
      data: {
        updated_activity: {
          id: 'error',
          time: 'N/A',
          title: 'AI Service Error',
          description: 'AI service temporarily unavailable',
          place: 'N/A',
          keyword: 'error',
        },
        alternative_options: [
          {
            option: 1,
            time: 'N/A',
            title: 'AI Service Error',
            description: 'AI service temporarily unavailable',
            place: 'N/A',
            keyword: 'error',
          },
        ],
      },
      message: error.response?.data?.message || 'Failed to get AI edit response',
    };
  }
};
