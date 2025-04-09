import { create } from 'zustand';

import { userAPI } from '@/api';
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
        await userAPI.requestLogout();
        queryClient.clear();
        window.location.href = '/login';
        set(() => ({
            isAuthenticated: false,
            userInfo: null,
        }));
    },
}));

export default useUserStore;
