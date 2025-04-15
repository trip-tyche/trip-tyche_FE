import { apiClient } from '@/api/client';

export const notifiactionAPI = {
    // 공유 알림 목록 조회
    getNotifications: async (userId: string) => {
        const response = await apiClient.get(`/v1/notifications/${userId}`);
        return { success: true, data: response.data };
    },
    // 알림 상태 변경 (READ / UNREAD)
    updateNotificationStatus: async (notificationId: string) => {
        const response = await apiClient.patch(`/v1/notifications/${notificationId}`);
        return { success: true, data: response.data };
    },
    // 알림 삭제
    deleteNotification: async (notificationId: number[]) => {
        const response = await apiClient.patch(`/v1/notifications/delete`, notificationId);
        return { success: true, data: response.data };
    },
};
