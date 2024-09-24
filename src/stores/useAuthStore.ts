import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    userId: string | null;
    token: string | null;
    setLogin: (userId: string, token: string) => void;
    setLogout: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
    isLogIn: false,
    userId: null,
    token: null,
    setLogin: (userId, token) => {
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('token', token);
        set({ isLogIn: true, userId, token });
    },
    setLogout: () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        set({ isLogIn: false, userId: null, token: null });
    },
}));

export default useAuthStore;
