import { create } from 'zustand';

interface AuthState {
    isLogIn: boolean;
    setLogout: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
    isLogIn: false,
    setLogout: () => {
        localStorage.clear();
        set(() => ({ isLogIn: false }));
    },
}));

export default useAuthStore;
