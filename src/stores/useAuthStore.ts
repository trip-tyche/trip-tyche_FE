import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    userId: string | null;
    token: string | null;
    userNickName: string | null;
    setLogin: (userId: string, token: string) => void;
    setLogout: () => void;
    setNickName: (nickname: string) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
    isLogIn: false,
    userId: null,
    token: null,
    userNickName: localStorage.getItem('userNickName'),
    setLogin: (userId, token) => {
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('token', token);
        set(() => ({ isLogIn: true }));
    },
    setLogout: () => {
        localStorage.clear();
        set(() => ({ isLogIn: false }));
    },
    setNickName: (nickname) => {
        localStorage.setItem('userNickName', nickname);
        set(() => ({
            userNickName: nickname,
        }));
    },
}));

export default useAuthStore;
