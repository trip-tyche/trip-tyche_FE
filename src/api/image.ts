import axios from 'axios';

import { ENV } from '@/constants/auth';
import { getToken } from '@/utils/auth';

const apiBaseUrl = ENV.API_BASE_URL;

export const fetchImagesByPinPoint = async (tripId: string, pinPoint: string) => {
    try {
        const token = getToken();
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/pinpoints/${pinPoint}/images`, {
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('핀포인트 슬라이드쇼 사진 데이터', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('핀포인트 슬라이드쇼 사진 데이터패칭에 실패하였습니다.', error);
    }
};

export const fetchImagesByDate = async (tripId: string, date: string) => {
    const formattedDate = date.slice(0, 10);
    try {
        const response = await axios.get(`${apiBaseUrl}/api/trips/${tripId}/map?date=${formattedDate}`, {
            headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
            },
        });
        console.log(`[${formattedDate}] 날짜 사진 데이터`, response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('[${formattedDate}] 날짜 사진 데이터패칭에 실패하였습니다.', error);
    }
};
