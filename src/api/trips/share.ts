import { apiClient } from '@/api/client';

export const shareAPI = {
    getUserByNickname: async (userNickName: string) => {
        const params = {
            userNickName,
        };

        const response = await apiClient.get(`/api/share/users`, {
            params,
        });

        if (response.status === 404) {
            return { isSuccess: false, error: '존재하지 않는 여행자입니다' };
        }

        return { isSuccess: true, data: response.data };
    },
    shareTripWithUser: async (tripId: string, recipientId: string) => {
        await apiClient.post(`/api/trips/share`, {
            tripId,
            recipientId,
        });
    },
    getSharedTrip: async (userId: string) => {
        const response = await apiClient.get(`/api/notifications/${userId}`);

        return response.data;
    },
    getSendTrip: async (recipientId: string) => {
        const response = await apiClient.get(`/api/trips/share/${recipientId}`);

        return response.data;
    },
    approveSharedTrip: async (recipientId: string, shareId: string, status: string) => {
        const params = {
            shareId,
            status,
        };
        const response = await apiClient.patch(`/api/trips/share/${recipientId}`, {
            params,
        });

        return response.data;
    },
};
