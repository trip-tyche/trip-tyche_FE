import { apiClient } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';
import { TripInfo } from '@/types/trip';
import { getToken } from '@/utils/auth';

export const tripAPI = {
    fetchTripTicketInfo: async (tripId: string) => {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}`);
            console.log('여행정보 데이터', response.data);
            return response.data.data;
        } catch (error) {
            console.error('여행정보 데이터패칭에 실패하였습니다.', error);
        }
    },
    fetchTripTicketList: async () => {
        try {
            const token = getToken();
            const response = await apiClient.get(`${API_ENDPOINTS.TRIPS}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('여행티켓리스트 데이터', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('여행티켓리스트 데이터패칭에 실패하였습니다.', error);
        }
    },
    fetchTripTimeline: async (tripId: string) => {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/info`, {});
            console.log('타임라인 데이터', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('타임라인 데이터패칭에 실패하였습니다.', error);
        }
    },
    createTrip: async () => {
        try {
            const token = getToken();
            const response = await apiClient.post(
                `${API_ENDPOINTS.TRIPS}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log('tripId가 등록되었습니다', response.data.data.tripId);
            return response.data.data.tripId;
        } catch (error) {
            console.error('tripId 등록에 실패하였습니다', error);
        }
    },
    createTripInfo: async ({ tripId, tripTitle, country, startDate, endDate, hashtags }: TripInfo) => {
        try {
            const token = getToken();
            const response = await apiClient.post(
                `${API_ENDPOINTS.TRIPS}/${tripId}/info`,
                {
                    tripTitle,
                    country,
                    startDate,
                    endDate,
                    hashtags,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log('여행정보가 등록되었습니다', response.data);
            return response.data;
        } catch (error) {
            console.error('여행정보 등록에 실패하였습니다', error);
        }
    },
    createTripImages: async (tripId: string, images: File[]) => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('files', image);
        });

        try {
            const response = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('여행사진이 등록되었습니다', response.data);
            return response.data;
        } catch (error) {
            console.error('여행사진 등록에 실패하였습니다', error);
        }
    },
    updateTripInfo: async (tripId: string, { tripTitle, country, startDate, endDate, hashtags }: TripInfo) => {
        try {
            const token = getToken();
            const response = await apiClient.put(
                `${API_ENDPOINTS.TRIPS}/${tripId}`,
                {
                    tripTitle,
                    country,
                    startDate,
                    endDate,
                    hashtags,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log('여행정보가 수정되었습니다', response.data);
            return response.data;
        } catch (error) {
            console.error('여행정보 수정에 실패하였습니다', error);
        }
    },
    deleteTripTicket: async (tripId: string) => {
        try {
            const token = getToken();
            const response = await apiClient.delete(`${API_ENDPOINTS.TRIPS}/${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('여행티켓이 삭제되었습니다.', response.data);
            return response.data;
        } catch (error) {
            console.error('여행티켓 삭제에 실패하였습니다.', error);
        }
    },
};
