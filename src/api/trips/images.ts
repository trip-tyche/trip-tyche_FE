import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { getToken } from '@/utils/auth';

export const tripImageAPI = {
    fetchImagesByPinPoint: async (tripId: string, pinPoint: string) => {
        try {
            const token = getToken();
            const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/pinpoints/${pinPoint}/images`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('핀포인트 슬라이드쇼 사진 데이터', data.data);
            return data.data;
        } catch (error) {
            console.error('핀포인트 슬라이드쇼 사진 데이터패칭에 실패하였습니다.', error);
        }
    },
    fetchImagesByDate: async (tripId: string, date: string) => {
        const formattedDate = date.slice(0, 10);
        try {
            const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/map?date=${formattedDate}`);
            console.log(`[${formattedDate}] 날짜 사진 데이터`, data.data);
            return data.data;
        } catch (error) {
            console.error('[${formattedDate}] 날짜 사진 데이터패칭에 실패하였습니다.', error);
        }
    },
};
