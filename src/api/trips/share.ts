import { apiClient } from '@/api/client';
import { getToken } from '@/utils/auth';

// interface Result<T> {
//     isSuccess: boolean;
//     data?: T;
//     error?: string;
// }

export const shareAPI = {
    // 사용자 검색(닉네임)
    searchUsers: async (userNickName: string) => {
        const response = await apiClient.get(`/api/share/users`, {
            params: {
                userNickName,
            },
        });

        if (response.status === 404) {
            return { isSuccess: false, error: '존재하지 않는 여행자입니다' };
        }

        return { isSuccess: true, data: response.data };
    },

    // 다른 사용자에게 여행 공유 요청
    createShareRequest: async (tripId: string, recipientId: string) => {
        await apiClient.post(`/api/trips/share`, {
            tripId,
            recipientId,
        });

        return { isSuccess: true, data: '' };
    },

    // 공유 알림 목록 조회
    getNotifications: async (userId: string) => {
        const response = await apiClient.get(`/api/notifications/${userId}`);

        return { isSuccess: true, data: response.data };
    },

    // 공유 상세 조회
    getShareDetail: async (shareId: string) => {
        const response = await apiClient.get(`/api/shares/${shareId}`);

        return { isSuccess: true, data: response.data };
    },

    // 알림 상태 변경 (READ / UNREAD)
    updateNotificationStatus: async (notificationId: string) => {
        const token = getToken();

        const response = await apiClient.patch(`/api/notifications/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response);
        return { isSuccess: true, data: response.data };
    },

    // 공유 상태 변경 (수락 / 거절)
    updateShareStatus: async (shareId: string, status: string) => {
        const params = {
            shareId,
            status,
        };

        const token = getToken();
        const response = await apiClient.patch(`/api/shares/${shareId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        });

        return { isSuccess: true, data: response.data };
    },
};
