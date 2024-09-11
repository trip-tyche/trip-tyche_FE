import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
    userNickName: string;
    setUserNickName: (userNickName: string) => void;
    isFirstUser: boolean;
    setIsFirstUser: (isFirstUser: boolean) => void;
}

const useUserStore = create<UserState>()(
    devtools(
        (set) => ({
            userNickName: '',
            setUserNickName: (userNickName) => set({ userNickName }),

            isFirstUser: true,
            setIsFirstUser: (isFirstUser) => set({ isFirstUser }),
        }),
        { name: 'User Store' },
    ),
);

export default useUserStore;
