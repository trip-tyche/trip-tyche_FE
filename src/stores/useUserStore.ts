import { create } from 'zustand';

interface UserState {
    isAuthenticated: boolean;
    nickname: string | null;
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
        window.location.href = '/login';
        set(() => ({
            isAuthenticated: false,
            nickname: null,
        }));
    },
}));

export default useUserStore;
