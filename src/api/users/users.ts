import { apiClient } from '@/api/shared/axios';
import { API_ENDPOINTS } from '@/constants/api';
import { getToken } from '@/utils/auth';

export const userAPI = {
    createUserNickName: async (userNickName: string) => {
        try {
            const token = getToken();
            const response = await apiClient.post(`${API_ENDPOINTS.USERS}/updateUserNickName`, userNickName, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            });
            console.log('사용자 닉네임이 등록되었습니다', response.data);
            return response.data;
        } catch (error) {
            console.error('사용자 닉네임 등록에 실패하였습니다', error);
            return error;
        }
    },
};
