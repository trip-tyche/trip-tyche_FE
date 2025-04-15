import { apiClient } from '@/api/client';
import { ApiResponse } from '@/api/types';

export const shareAPI = {
    // 다른 사용자에게 여행 공유 요청
    createShareRequest: async (
        tripKey: string,
        recipientId: number,
    ): Promise<ApiResponse<{ shareId: number; tripId: number; recipientId: number; shareStatus: string }>> =>
        await apiClient.post(`/v1/trips/share`, {
            tripKey,
            recipientId,
        }),
    // 공유 상세 조회
    getShareDetail: async (shareId: string) => {
        const response = await apiClient.get(`/v1/shares/${shareId}`);

        return { success: true, data: response.data };
    },
    // 공유 상태 변경 (수락 / 거절)
    updateShareStatus: async (shareId: string, status: string) => {
        const params = {
            status,
        };

        const response = await apiClient.patch(`/v1/shares/${shareId}`, null, {
            params,
        });

        return { success: true, data: response.data };
    },
};
