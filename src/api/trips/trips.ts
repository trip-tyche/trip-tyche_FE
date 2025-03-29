import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { Result } from '@/types/apis/common';
import { Trip } from '@/types/trip';

export const tripAPI = {
    // 사용자의 전체 여행 티켓 목록 조회
    fetchTripTicketList: async (): Promise<Result<Trip[]>> => {
        try {
            const response = await apiClient.get(`/v1/trips`);
            const { data } = response;

            if (!data.result) {
                return { isSuccess: false, error: '데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.' };
            }

            return { isSuccess: true, data: data.trips };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
    // 특정 여행의 티켓 상세 정보 조회
    fetchTripTicketInfo: async (tripId: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}`);

        return response.data;
    },
    // 새 티켓 등록을 위한 tripId 생성
    createTripTicket: async () => {
        const response = await apiClient.post(`${API_ENDPOINTS.TRIPS}`);

        return response.data.tripId;
    },
    // 기존 여행 티켓 정보 수정
    updateTripTicketInfo: async (tripId: string, tripInfo: Trip) => {
        const response = await apiClient.put(`${API_ENDPOINTS.TRIPS}/${tripId}`, tripInfo);

        return response;
    },
    // 여행 티켓 삭제
    deleteTripTicket: async (tripId: string) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.TRIPS}/${tripId}`);

        return response;
    },

    // 여행 타임라인 및 지도 표시용 정보 조회
    fetchTripTimeline: async (tripId: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.TRIPS}/${tripId}/info`);
        return response.data;
    },
};
