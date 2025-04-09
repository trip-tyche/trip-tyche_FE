import { create } from 'zustand';

import { queryClient } from '@/providers/TanStackProvider';
import { UserInfo } from '@/types/user';

interface UserState {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    login: (userInfo: UserInfo) => void;
    logout: () => void;
}

const useUserStore = create<UserState>()((set) => ({
    isAuthenticated: false,
    userInfo: null,
    login: (userInfo: UserInfo) => {
        set(() => ({
            isAuthenticated: true,
            userInfo,
        }));
    },
    logout: async () => {
        // TODO: 로그아웃 API 요청 추가
        queryClient.clear();
        window.location.href = '/login';
        set(() => ({
            isAuthenticated: false,
            userInfo: null,
        }));
    },
}));

export default useUserStore;
