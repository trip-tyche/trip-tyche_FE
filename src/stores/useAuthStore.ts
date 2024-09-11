import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    userId: number | null;
    token: string | null;
    setLogin: (userId: number, token: string) => void;
    logout: () => void;
    // checkAuthStatus: () => boolean;
}

const useAuthStore = create<AuthState>()((set, get) => ({
    isLogIn: false,
    userId: null,
    token: null,
    setLogin: (userId, token) => {
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('token', token);
        set({ isLogIn: true, userId, token });
    },
    logout: () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        set({ isLogIn: false, userId: null, token: null });
    },
    // checkAuthStatus: () => {
    //     const token = localStorage.getItem('token');
    //     const expiry = localStorage.getItem('tokenExpiry');
    //     if (token && expiry) {
    //         const now = Date.now();
    //         if (now < parseInt(expiry)) {
    //             const user = JSON.parse(localStorage.getItem('user') || '{}');
    //             set({ isLogIn: true, user, token, tokenExpiry: parseInt(expiry) });
    //             return true;
    //         }
    //     }
    //     get().logout(); // 토큰이 만료되었거나 없으면 로그아웃
    //     return false;
    // },
}));

export default useAuthStore;
