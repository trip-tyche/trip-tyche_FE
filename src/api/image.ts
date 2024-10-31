import axios from 'axios';

import { ENV } from '@/constants/auth';
import { getToken } from '@/utils/auth';

const apiBaseUrl = ENV.BASE_URL;
const token = getToken();

export const getImagesByPinPoint = async (tripId: string, pinPoint: string) => {
    try {
        const token = getToken();
        // const response = await axios.get(
        //     `${apiBaseUrl ? `/api/trips/${tripId}/pinpoints/${pinPoint}/images` : `${apiBaseUrl}/api/trips/${tripId}/pinpoints/${pinPoint}/images`}`,
        //     {
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/pinpoints/${pinPoint}/images`, {
            // const response = await axios.get(`/api/trips/${tripId}/pinpoints/${pinPoint}/images`, {
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
    const formattedDate = date.slice(0, 10);
    try {
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/map?date=${formattedDate}`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`${formattedDate}의 이미지를 불러오는데 실패`, error);
    }
};
