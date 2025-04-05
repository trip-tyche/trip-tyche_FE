import { apiClient } from '@/api/client';

export const userAPI = {
    // 사용자 정보 조회
    fetchUserInfo: async () => {
        try {
            const response = await apiClient.get(`/v1/users/me/summary`);
            const { data } = response;

            if (!data) {
                return { isSuccess: false, error: '데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.' };
            }

            return { isSuccess: true, data: response.data };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
        }
    },
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
