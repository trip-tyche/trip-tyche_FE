import axios from 'axios';

import { ENV } from '@/constants/auth';
import { getToken } from '@/utils/auth';

const apiBaseUrl = ENV.BASE_URL;

export const getImagesByPinPoint = async (tripId: string, pinPoint: string) => {
    try {
        const token = getToken();
        // const response = await axios.get(`/api/trips/${tripId}/pinpoints/${pinPoint}/images`, {
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
        // const response = await axios.get(`/api/trips/${tripId}/map?date=${date}`, {
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
