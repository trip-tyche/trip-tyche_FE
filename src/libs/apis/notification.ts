import { Notification } from '@/domains/notification/types';
import { apiClient } from '@/libs/apis/shared/client';
import { ApiResponse } from '@/libs/apis/shared/types';

export const notifiactionAPI = {
    // 공유 알림 목록 조회
    fetchNotificationList: async (userId: number): Promise<ApiResponse<Notification[]>> =>
        await apiClient.get(`/v1/users/${userId}/notifications`),
    // 알림 상태 변경 (READ / UNREAD)
    updateNotificationStatus: async (notificationId: number): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/notifications/${notificationId}`),
    // 알림 삭제
    deleteNotification: async (notificationId: number[]): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/notifications/delete`, notificationId),
    // 알림 상세 조회
    fetchNotificationDetail: async (
        notificationId: number,
    ): Promise<ApiResponse<{ message: string; senderNickname: string; tripTitle: string }>> =>
        await apiClient.get(`/v1/notifications/${notificationId}`),
};
