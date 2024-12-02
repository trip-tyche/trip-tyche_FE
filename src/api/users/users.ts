import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api/config';
import { getToken } from '@/utils/auth';

export const userAPI = {
    createUserNickName: async (userNickName: string) => {
        const token = getToken();
        const data = await apiClient.post(`${API_ENDPOINTS.USERS}/updateUserNickName`, userNickName, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
        });
        return data;
    },
};
