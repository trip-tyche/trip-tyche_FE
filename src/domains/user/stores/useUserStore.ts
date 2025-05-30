import { create } from 'zustand';

import { UserInfo } from '@/domains/user/types';
import { userAPI } from '@/libs/apis';
import { queryClient } from '@/shared/providers/TanStackProvider';

interface UserState {
    isLoggingOut: boolean;
    userInfo: UserInfo | null;
    updateNickname: (nickname: string) => void;
    login: (userInfo: UserInfo) => void;
    logout: () => void;
}

const useUserStore = create<UserState>()((set, get) => ({
    isLoggingOut: false,
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
    login: (userInfo: UserInfo) => {
        set(() => ({
            userInfo,
        }));
    },
    logout: async () => {
        set(() => ({
            isLoggingOut: true,
        }));

        await userAPI.requestLogout();
        queryClient.clear();
        set(() => ({
            userInfo: null,
            isLoggingOut: false,
        }));
        window.location.replace('/signin');
    },
}));

export default useUserStore;
