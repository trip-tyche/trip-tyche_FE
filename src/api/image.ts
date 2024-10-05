import axios from 'axios';

import { getToken } from '@/utils/auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
        return response.data;
    } catch (error) {
        console.error('Error fetching pinpoint-images data:', error);
    }
};

export const getImagesByDay = async (tripId: string, date: string) => {
    try {
        const token = getToken();
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/map?date=${date}`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pinpoint-images data:', error);
    }
};
