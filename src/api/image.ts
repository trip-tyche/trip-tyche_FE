import axios from 'axios';

import { ENV } from '@/constants/auth';
import { getToken } from '@/utils/auth';

const apiBaseUrl = ENV.BASE_URL;

export const getImagesByPinPoint = async (tripId: string, pinPoint: string) => {
    try {
        const token = getToken();
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/pinpoints/${pinPoint}/images`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching pinpoint-images data:', error);
    }
};

export const getImagesByDay = async (tripId: string, date: string) => {
    const formattedDate = date.slice(0, 10);
    try {
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/map?date=${formattedDate}`, {
            headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error(`${formattedDate}의 이미지를 불러오는데 실패`, error);
    }
};
