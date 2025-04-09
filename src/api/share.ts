import { apiClient } from '@/api/client';

export const shareAPI = {
    // 다른 사용자에게 여행 공유 요청
    createShareRequest: async (tripId: string, recipientId: string) => {
        await apiClient.post(`/v1/trips/share`, {
            tripId,
            recipientId,
        });

        return { isSuccess: true, data: '' };
    },

    // 공유 알림 목록 조회
    getNotifications: async (userId: string) => {
        const response = await apiClient.get(`/v1/notifications/${userId}`);

        return { isSuccess: true, data: response.data };
    },

    // 공유 상세 조회
    getShareDetail: async (shareId: string) => {
        const response = await apiClient.get(`/v1/shares/${shareId}`);

        return { isSuccess: true, data: response.data };
    },

    // 알림 상태 변경 (READ / UNREAD)
    updateNotificationStatus: async (notificationId: string) => {
        const response = await apiClient.patch(`/v1/notifications/${notificationId}`);

        return { isSuccess: true, data: response.data };
    },

    // 알림 삭제
    deleteNotification: async (notificationId: number[]) => {
        const response = await apiClient.patch(`/v1/notifications/delete`, notificationId);

        return { isSuccess: true, data: response.data };
    },

    // 공유 상태 변경 (수락 / 거절)
    updateShareStatus: async (shareId: string, status: string) => {
        const params = {
            status,
        };

        const response = await apiClient.patch(`/v1/shares/${shareId}`, null, {
            params,
        });

        return { isSuccess: true, data: response.data };
    },
};
