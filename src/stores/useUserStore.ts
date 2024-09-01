import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
    userNickName: string;
    setUserNickName: (userNickName: string) => void;
}

const useUserStore = create<UserState>()(
    devtools(
        (set) => ({
            userNickName: '',
            setUserNickName: (userNickName) => set({ userNickName }),
        }),
        { name: 'User Store' },
    ),
);

export default useUserStore;
