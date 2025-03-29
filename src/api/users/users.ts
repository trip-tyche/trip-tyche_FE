import { apiClient } from '@/api/client';

export const userAPI = {
    // 사용자 닉네임 등록 및 수정
    createUserNickName: async (nickname: string) => {
        const response = await apiClient.patch(`/v1/users/me`, { nickname });
        return response;
    },
    // 사용자 닉네임 중복확인
    checkDuplication: async (nickname: string) => {
        const params = {
            nickname,
        };
        const response = await apiClient.get(`/v1/nicknames`, {
            params,
        });

        return response;
    },
};
