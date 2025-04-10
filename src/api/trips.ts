import { apiClient } from '@/api/client';
import { ApiResponse } from '@/api/utils';
import { Trip } from '@/types/trip';

export const tripAPI = {
    // 사용자의 전체 여행 티켓 목록 조회
    fetchTripTicketList: async (): Promise<ApiResponse<{ trips: Trip[] }>> => await apiClient.get(`/v1/trips`),
    // 특정 여행의 티켓 상세 정보 조회
    fetchTripTicketInfo: async (tripId: string) => {
        const response = await apiClient.get(`/v1/trips/${tripId}`);

        return response.data;
    },
    // 새 여행 등록을 위한 tripId 생성
    createNewTrip: async (): Promise<ApiResponse<{ tripId: number }>> => await apiClient.post(`/v1/trips`),
    // 기존 여행 티켓 정보 수정
    updateTripTicketInfo: async (tripId: string, tripInfo: Trip) => {
        const response = await apiClient.put(`/v1/trips/${tripId}`, tripInfo);

        return response;
    },
    // 여행 티켓 최종 등록
    finalizeTripTicekt: async (tripId: string) => {
        await apiClient.patch(`/v1/trips/${tripId}/finalize`);
    },
    // 여행 티켓 삭제
    deleteTripTicket: async (tripId: string) => {
        const response = await apiClient.delete(`/v1/trips/${tripId}`);

        return response;
    },

    // 여행 타임라인 및 지도 표시용 정보 조회
    fetchTripTimeline: async (tripId: string) => {
        const response = await apiClient.get(`/v1/trips/${tripId}/info`);
        return response.data;
    },
};
