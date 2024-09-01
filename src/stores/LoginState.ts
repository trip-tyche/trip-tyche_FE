import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LoginState {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

const useLoginState = create<LoginState>()(
    devtools(
        (set) => ({
            isLogin: false,
            setIsLogin: (isLogin) => set({ isLogin }),
        }),
        {
            name: 'login-store',
        },
    ),
);

export default useLoginState;
