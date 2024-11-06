import axios from 'axios';

import { ENV } from '@/constants/auth';
import { TripInfo } from '@/types/trip';
import { getToken } from '@/utils/auth';

const apiBaseUrl = ENV.BASE_URL;
const token = getToken();

export const postTripInfo = async ({ tripId, tripTitle, country, startDate, endDate, hashtags }: TripInfo) => {
    try {
        const token = getToken();
        const response = await axios.post(
            `${apiBaseUrl}/api/trips/${tripId}/info`,
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
        console.error('Error post trip-info:', error);
    }
};

export const updateTripInfo = async (
    tripId: string,
    { tripTitle, country, startDate, endDate, hashtags }: TripInfo,
) => {
    try {
        const token = getToken();
        const response = await axios.put(
            // `/api/trips/${tripId}`,
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
                    'Content-Type': 'application/json',
                },
            },
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error update trip-info:', error);
    }
};

export const getTripMapData = async (tripId: string) => {
    try {
        const token = getToken();
        // const response = await axios.get(`/api/trips/${tripId}/info`, {
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/info`, {
            headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching trip-map-data:', error);
    }
};

// ////////
export const getTripList = async () => {
    const token = getToken();
    try {
        const response = await axios.get(`${apiBaseUrl}/api/trips`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('여행 데이터패칭 중 오류 발생', error);
    }
};

export const postTripImages = async (tripId: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image) => {
        formData.append('files', image);
    });

    console.log(token);
    console.log('files:', formData.getAll('files'));

    try {
        const token = getToken();
        const response = await axios.post(`${apiBaseUrl}/api/trips/${tripId}/upload`, formData, {
            headers: {
                accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('이미지 업로드 중 오류 발생', error);
    }
};

export const deleteTripInfo = async (tripId: string) => {
    try {
        const token = getToken();
        const response = await axios.delete(`${apiBaseUrl}/api/trips/${tripId}`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('여행 삭제 중 오류 발생', error);
    }
};

export const createTripId = async () => {
    try {
        const token = getToken();
        const response = await axios.post(
            `${apiBaseUrl}/api/trips`,
            {},
            {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data.data.tripId;
    } catch (error) {
        console.error('새로운 tripId 생성 실패', error);
    }
};

export const getTripData = async (tripId: string) => {
    try {
        const token = getToken();
        const { data } = await axios.get(`${apiBaseUrl}/api/trips/${tripId}`, {
            headers: {
                accept: '*/*',
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(data);
        return data.data;
    } catch (error) {
        console.error('Error fetching trip data:', error);
    }
};
