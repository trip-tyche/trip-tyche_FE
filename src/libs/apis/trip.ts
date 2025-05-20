import { Trip } from '@/domains/trip/types';
import { apiClient } from '@/libs/apis/shared/client';
import { ApiResponse } from '@/libs/apis/shared/types';

export const tripAPI = {
    // 사용자의 전체 여행 티켓 목록 조회
    fetchTripTicketList: async (): Promise<ApiResponse<{ trips: Trip[] }>> => await apiClient.get(`/v1/trips`),
    // 특정 여행의 티켓 상세 정보 조회
    fetchTripTicketInfo: async (tripKey: string): Promise<ApiResponse<Trip>> =>
        await apiClient.get(`/v1/trips/${tripKey}`),
    // 여행 티켓 최종 등록
    finalizeTripTicket: async (tripKey: string): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/trips/${tripKey}/finalize`),
    // 새 여행 등록을 위한 tripKey 생성
    createNewTrip: async (): Promise<ApiResponse<{ tripKey: string }>> => await apiClient.post(`/v1/trips`),
    // 기존 여행 티켓 정보 수정
    updateTripForm: async (tripKey: string, tripInfo: Trip): Promise<ApiResponse<string>> =>
        await apiClient.put(`/v1/trips/${tripKey}`, tripInfo),
    // 여행 티켓 삭제
    deleteTripTicket: async (tripKey: string): Promise<ApiResponse<string>> =>
        await apiClient.delete(`/v1/trips/${tripKey}`),
};
