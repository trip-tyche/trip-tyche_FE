import axios from 'axios';

import { TripInfo, Trips } from '@/types/trip';
import { getToken } from '@/utils/auth';

const token2 = getToken();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getTripList = async (token: string | null): Promise<Trips> => {
    try {
        const response = await axios.get<Trips>(`${apiBaseUrl}/api/trips`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const postTripInfo = async (
    { tripTitle, country, startDate, endDate, hashtags }: TripInfo,
    token: string | null,
) => {
    try {
        const response = await axios.post(
            `${apiBaseUrl}/api/trips`,
            {
                tripTitle,
                country,
                startDate,
                endDate,
                hashtags,
            },
            {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const postTripImages = async (tripId: string, files: File[], token: string | null) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post(`${apiBaseUrl}/api/trips/${tripId}/upload`, formData, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const updateTripInfo = async (
    tripId: string,
    { tripTitle, country, startDate, endDate, hashtags }: TripInfo,
    token: string | null,
) => {
    try {
        const response = await axios.put(
            `${apiBaseUrl}/api/trips/${tripId}`,
            {
                tripTitle,
                country,
                startDate,
                endDate,
                hashtags,
            },
            {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log('Update Success');
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const deleteTripInfo = async (tripId: string, token: string | null) => {
    try {
        const response = await axios.delete(`${apiBaseUrl}/api/trips/${tripId}`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Delete Success');
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const fetchTripMapData = async (tripId: string) => {
    try {
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/info`, {
            headers: {
                Authorization: `Bearer ${token2}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};
