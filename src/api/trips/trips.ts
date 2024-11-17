import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { TripInfo, TripInfoModel } from '@/types/trip';
import { getToken } from '@/utils/auth';

export const tripAPI = {
    fetchTripTicketInfo: async (tripId: string) => {
        try {
            const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}`);
            console.log('여행정보 데이터', data.data);
            return data.data;
        } catch (error) {
            console.error('여행정보 데이터패칭에 실패하였습니다.');
        }
    },
    fetchTripTicketList: async () => {
        try {
            const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}`);
            console.log('여행티켓리스트 데이터', data.data);
            return data.data;
        } catch (error) {
            console.error('여행티켓리스트 데이터패칭에 실패하였습니다.');
        }
    },
    fetchTripTimeline: async (tripId: string) => {
        try {
            const data = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/info`, {});
            console.log('타임라인 데이터', data.data);
            return data.data;
        } catch (error) {
            console.error('타임라인 데이터패칭에 실패하였습니다.', error);
        }
    },
    createTrip: async () => {
        try {
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
            console.log('tripId가 등록되었습니다', data.data.tripId);
            return data.data.tripId;
        } catch (error) {
            console.error('tripId 등록에 실패하였습니다', error);
        }
    },
    createTripInfo: async (tripId: string, tripInfo: TripInfoModel) => {
        try {
            const token = getToken();
            const data = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/info`, tripInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('여행정보가 등록되었습니다', data.data);
            return data;
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
            const data = await apiClient.post(`${API_ENDPOINTS.TRIPS}/${tripId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('여행사진이 등록되었습니다', data);
            return data;
        } catch (error) {
            console.error('여행사진 등록에 실패하였습니다', error);
        }
    },
    updateTripInfo: async (tripId: string, tripInfo: TripInfo) => {
        try {
            const token = getToken();
            const data = await apiClient.put(`${API_ENDPOINTS.TRIPS}/${tripId}`, tripInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('여행정보가 수정되었습니다', data);
            return data;
        } catch (error) {
            console.error('여행정보 수정에 실패하였습니다', error);
        }
    },
    deleteTripTicket: async (tripId: string) => {
        try {
            const token = getToken();
            const data = await apiClient.delete(`${API_ENDPOINTS.TRIPS}/${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(data.data);
            return data;
        } catch (error) {
            console.error('여행티켓 삭제에 실패하였습니다.', error);
        }
    },
};
