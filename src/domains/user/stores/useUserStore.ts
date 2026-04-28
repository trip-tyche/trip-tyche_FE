import { create } from 'zustand';

import { UserInfo } from '@/domains/user/types';
import { userAPI } from '@/libs/apis';
import { queryClient } from '@/shared/providers/TanStackProvider';

interface UserState {
    isLoggingOut: boolean;
    isGuest: boolean;
    userInfo: UserInfo | null;
    updateNickname: (nickname: string) => void;
    loginAsGuest: () => Promise<void>;
    login: (userInfo: UserInfo) => void;
    logout: () => void;
}

const useUserStore = create<UserState>()((set, get) => ({
    isLoggingOut: false,
    isGuest: false,
    userInfo: null,
    updateNickname: (nickname: string) => {
        const { userInfo } = get();
        if (!userInfo) return;

        set(() => ({
            userInfo: {
                ...userInfo,
                nickname,
            },
        }));
    },
    loginAsGuest: async () => {
        await userAPI.postGuestLogin();
    },
    login: (userInfo: UserInfo) => {
        set({
            userInfo,
            isGuest: userInfo.role === 'GUEST',
        });
    },
    logout: async () => {
        set(() => ({
            isLoggingOut: true,
        }));

        try {
            await userAPI.requestLogout();
        } catch {
            // API 실패해도 클라이언트 세션은 반드시 초기화
        } finally {
            queryClient.clear();
            set(() => ({
                userInfo: null,
                isLoggingOut: false,
            }));
            window.location.replace('/signin');
        }
    },
}));

export default useUserStore;
