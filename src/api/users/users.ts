import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { getToken } from '@/utils/auth';

export const userAPI = {
    createUserNickName: async (userNickName: string) => {
        try {
            const token = getToken();
            const data = await apiClient.post(`${API_ENDPOINTS.USERS}/updateUserNickName`, userNickName, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            });
            console.log(data.data);
            return data;
        } catch (error) {
            console.error('사용자 닉네임 등록에 실패하였습니다', error);
            return error;
        }
    },
};
