import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    userId: string | null;
    token: string | null;
    setLogin: (userId: string, token: string) => void;
    setLogout: () => void;
}

const useAuthStore = create<AuthState>()(() => ({
    isLogIn: false,
    userId: null,
    token: null,
    setLogin: (userId, token) => {
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('token', token);
    },
    setLogout: () => {
        localStorage.clear();
    },
}));

export default useAuthStore;
