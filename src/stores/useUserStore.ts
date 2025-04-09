import { create } from 'zustand';

import { queryClient } from '@/providers/TanStackProvider';

interface UserState {
    isAuthenticated: boolean;
    nickname: string | null;
    userId: number | null;
    setNickname: (nickname: string) => void;
    login: (nickname: string, userId: number) => void;
    logout: () => void;
}

const useUserStore = create<UserState>()((set) => ({
    isAuthenticated: false,
    nickname: null,
    userId: null,
    setNickname: (nickname: string) => set({ nickname }),
    login: (nickname, userId) => {
        set(() => ({
            isAuthenticated: true,
            nickname,
            userId,
        }));
    },
    logout: async () => {
        // TODO: 로그아웃 API 요청 추가
        queryClient.clear();
        window.location.href = '/login';
        set(() => ({
            isAuthenticated: false,
            nickname: null,
            userId: null,
        }));
    },
}));

export default useUserStore;
