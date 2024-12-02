import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { getToken } from '@/utils/auth';

export const tripImageAPI = {
    fetchImagesByPinPoint: async (tripId: string, pinPoint: string) => {
        const token = getToken();
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/pinpoints/${pinPoint}/images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data;
    },
    fetchImagesByDate: async (tripId: string, date: string) => {
        const formattedDate = date.slice(0, 10);
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/map?date=${formattedDate}`);
        return data.data;
    },
};
