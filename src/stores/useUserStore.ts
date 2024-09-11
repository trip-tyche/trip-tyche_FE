import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
    userNickName: string;
    saveUserNickName: (userNickName: string) => void;
}

const useUserStore = create<UserState>()(
    devtools(
        (set) => ({
            userNickName: '',
            saveUserNickName: (userNickName) => set({ userNickName }),
        }),
        { name: 'User Store' },
    ),
);

export default useUserStore;
