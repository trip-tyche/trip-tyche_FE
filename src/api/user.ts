import axios from 'axios';

import { getToken } from '@/utils/auth';

interface Trip {
    tripId: number;
    country: string;
}

interface PinPoint {
    tripId: number;
    pinPointId: number;
    latitude: number;
    longitude: number;
}

interface UserInfo {
    userId: number;
    userNickName: string;
    trips: Trip[];
    pinPoints: PinPoint[];
}

export const fetchUserInfo = async (userId: number): Promise<UserInfo> => {
    try {
        const token = getToken();
        const response = await axios.get<UserInfo>(
            `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/user/tripInfo?userId=${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );
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
        const response = await axios.post(
            `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/user/updateUserNickName`,
            userNickName,
            {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('==> ', error);
        return error;
    }
};
