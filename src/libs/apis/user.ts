import { UserInfo } from '@/domains/user/types';
import { apiClient } from '@/libs/apis/shared/client';
import { ApiResponse } from '@/libs/apis/shared/types';

export const userAPI = {
    // 사용자 정보 조회 (userId, nickname, tripsCount, recentTrip)
    fetchUserInfo: async (): Promise<ApiResponse<UserInfo>> => await apiClient.get(`/v1/users/me/summary`),
    // 닉네임을 통한 사용자 검색 (userId, nickname)
    searchUsers: async (nickname: string): Promise<ApiResponse<Pick<UserInfo, 'userId' | 'nickname'>>> =>
        await apiClient.get(`/v1/share/users?nickname=${nickname}`),
    // 사용자 닉네임 중복확인
    checkNicknameDuplication: async (nickname: string): Promise<ApiResponse<string>> =>
        await apiClient.get(`/v1/nicknames?nickname=${nickname}`),
    // 사용자 닉네임 등록 및 수정
    createNickName: async (nickname: string): Promise<ApiResponse<string>> =>
        await apiClient.patch(`/v1/users/me`, { nickname }),
    // 로그아웃
    requestLogout: async () => await apiClient.post(`/v1/auth/logout`),
};
