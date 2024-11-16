import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    setLogin: (userId: string, token: string) => void;
    setLogout: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
    isLogIn: false,
    setLogin: (userId, token) => {
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('token', token);
        set(() => ({ isLogIn: true }));
    },
    setLogout: () => {
        localStorage.clear();
        set(() => ({ isLogIn: false }));
    },
}));

export default useAuthStore;
