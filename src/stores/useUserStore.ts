import { create } from 'zustand';

import { queryClient } from '@/providers/TanStackProvider';

interface UserState {
    isAuthenticated: boolean;
    nickname: string | null;
    setNickname: (nickname: string) => void;
    login: () => void;
    logout: () => void;
}

const useUserStore = create<UserState>()((set) => ({
    isAuthenticated: false,
    nickname: null,
    setNickname: (nickname: string) => set({ nickname }),
    login: () => {
        set(() => ({ isAuthenticated: true }));
    },
    logout: async () => {
        // TODO: 로그아웃 API 요청 추가
        queryClient.clear();
        window.location.href = '/login';
        set(() => ({
            isAuthenticated: false,
            nickname: null,
        }));
    },
}));

export default useUserStore;
