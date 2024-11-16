import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    // userNickName: string | null;
    setLogin: (userId: string, token: string) => void;
    setLogout: () => void;
    // setUserNickName: (userNickName: string) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
    isLogIn: false,
    // userNickName: localStorage.getItem('userNickName') || '',
    setLogin: (userId, token) => {
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('token', token);
        set(() => ({ isLogIn: true }));
    },
    setLogout: () => {
        localStorage.clear();
        set(() => ({ isLogIn: false }));
    },
    // setUserNickName: (userNickName) => {
    //     localStorage.setItem('userNickName', userNickName);
    //     set(() => ({
    //         userNickName,
    //     }));
    // },
}));

export default useAuthStore;
