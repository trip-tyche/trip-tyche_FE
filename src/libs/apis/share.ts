import { SharedTripDetail } from '@/domains/share/types';
import { apiClient } from '@/libs/apis/client';
import { ApiResponse } from '@/libs/apis/types';

export const shareAPI = {
    // 다른 사용자에게 여행 공유 요청
    requestTripShare: async (
        tripKey: string,
        recipientId: number,
    ): Promise<ApiResponse<{ shareId: number; tripId: number; recipientId: number; shareStatus: string }>> =>
        await apiClient.post(`/v1/trips/share`, {
            tripKey,
            recipientId,
        }),
    // 공유 상세 조회
    fetchShareDetail: async (shareId: number): Promise<ApiResponse<SharedTripDetail>> =>
        await apiClient.get(`/v1/shares/${shareId}`),
    // 공유 상태 변경 (수락 / 거절)
    updateShareStatus: async (shareId: number, status: string): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/shares/${shareId}?status=${status}`),
    // 공유 관계 해제
    unlinkShared: async (shareId: number): Promise<ApiResponse<string>> =>
        await apiClient.delete(`/v1/shares/${shareId}`),
};
