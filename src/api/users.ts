import { AxiosError } from 'axios';

import { apiClient } from '@/api/client';
import { ApiResponse } from '@/api/types';
import { UserInfo } from '@/types/user';

export const userAPI = {
    // 사용자 정보 조회 (nickname, tripsCount, recentTrip)
    // fetchUserInfo: async () => {
    //     try {
    //         const response = await apiClient.get(`/v1/users/me/summary`);
    //         const { data } = response;
    //         if (!data) {
    //             return { success: false, error: '데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.' };
    //         }

    //         return { success: true, data };
    //     } catch (error) {
    //         if (error instanceof AxiosError) {
    //             const errorResponse = error?.response?.data;
    //             return { success: false, error: errorResponse.message };
    //         }
    //         return { success: false, error: '알 수 없는 오류가 발생하였습니다' };
    //     }
    // },
    fetchUserInfo: async (): Promise<ApiResponse<UserInfo>> => await apiClient.get(`/v1/users/me/summary`),
    // 닉네임을 통한 사용자 검색 (userId, nickname)
    searchUsers: async (nickname: string) => {
        const response = await apiClient.get(`/v1/share/users`, {
            params: {
                nickname,
            },
        });

        if (response.status === 404) {
            return { success: false, error: '존재하지 않는 여행자입니다' };
        }

        return { success: true, data: response.data };
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
    requestLogout: async () => {
        await apiClient.post(`/v1/auth/logout`);
    },
};
