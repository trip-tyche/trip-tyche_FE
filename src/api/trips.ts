import axios from 'axios';

import { getToken, getUserId } from '@/utils/auth';

interface Trip {
    tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
interface Trips {
    userNickName: string;
    trips: Trip[];
}

interface TripInfo {
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

const token2 = getToken();

export const fetchTripsList = async (token: string | null): Promise<Trips> => {
    try {
        const response = await axios.get<Trips>(
            'http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const postTripInfo = async (
    token: string | null,
    { tripTitle, country, startDate, endDate, hashtags }: TripInfo,
) => {
    try {
        const response = await axios.post(
            'http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips',
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

export const postTripImages = async (token: string | null, tripId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post(
            `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips/${tripId}/upload`,
            formData,
            {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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

export const updateTripInfo = async (
    token: string | null,
    tripId: string,
    { tripTitle, country, startDate, endDate, hashtags }: TripInfo,
) => {
    try {
        const response = await axios.put(
            `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips/${tripId}`,
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

export const deleteTripInfo = async (token: string | null, tripId: string) => {
    try {
        const response = await axios.delete(
            `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips/${tripId}`,
            {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log('Delete Success');
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const fetchTripMapData = async (tripId: string) => {
    try {
        const response = await axios.get(
            `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips/${tripId}/info`,
            {
                headers: {
                    Authorization: `Bearer ${token2}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};
