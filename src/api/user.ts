import axios from 'axios';

import { UserInfo } from '@/types/user';
import { getToken } from '@/utils/auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getUserData = async (userId: string): Promise<UserInfo> => {
    try {
        const token = getToken();
        const response = await axios.get<UserInfo>(`/api/user/tripInfo?userId=${userId}`, {
            // const response = await axios.get<UserInfo>(`${apiBaseUrl}/api/user/tripInfo?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const { data } = response;
        return {
            userId: data.userId,
            userNickName: data.userNickName,
            trips: data.trips,
            pinPoints: data.pinPoints,
        };
    } catch (error) {
        console.error('==> ', error);
        throw error;
    }
};

export const postUserNickName = async (userNickName: string) => {
    try {
        const token = getToken();
        const response = await axios.post(`/api/user/updateUserNickName`, userNickName, {
            // const response = await axios.post(`${apiBaseUrl}/api/user/updateUserNickName`, userNickName, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
        });
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        return error;
    }
};
