import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { Trip } from '@/types/trip';
import { getToken } from '@/utils/auth';

export const tripAPI = {
    // 여행정보 수정을 위한 조회
    fetchTripTicketInfo: async (tripId: string) => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}`);
        return data.data;
    },
    // 사용자 여행 정보 조회
    fetchTripTicketList: async () => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}`);

        return data.data;
    },
    fetchTripTimeline: async (tripId: string) => {
        const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/info`);
        return data.data;
    },
    createTrip: async () => {
        const token = getToken();
        const data = await apiClient.post(
            `${API_ENDPOINTS.TRIPS}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return data.data.tripId;
    },
    createTripInfo: async (tripId: string, tripInfo: Trip) => {
        const token = getToken();
        const data = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/info`, tripInfo, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    updateTripInfo: async (tripId: string, tripInfo: Trip) => {
        const { country, endDate, startDate, tripTitle, hashtags } = tripInfo;
        const newTripInfo = { country, endDate, startDate, tripTitle, hashtags };
        const data = await apiClient.put(`${API_ENDPOINTS.TRIPS}/${tripId}`, newTripInfo);
        return data;
    },
    deleteTripTicket: async (tripId: string) => {
        const token = getToken();
        const data = await apiClient.delete(`${API_ENDPOINTS.TRIPS}/${tripId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
};
