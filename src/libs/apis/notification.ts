import { Notification } from '@/domains/notification/types';
import { apiClient } from '@/libs/apis/client';
import { ApiResponse } from '@/libs/apis/types';

export const notifiactionAPI = {
    // 공유 알림 목록 조회
    fetchNotificationList: async (userId: number): Promise<ApiResponse<Notification[]>> =>
        await apiClient.get(`/v1/notifications/${userId}`),
    // 알림 상태 변경 (READ / UNREAD)
    updateNotificationStatus: async (notificationId: number): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/notifications/${notificationId}`),
    // 알림 삭제
    deleteNotification: async (notificationId: number[]): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/notifications/delete`, notificationId),
};
