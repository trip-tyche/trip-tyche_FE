import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FirstUserState {
    isFirstUser: boolean;
    setIsFirstUser: (isFirstUser: boolean) => void;
}

const useFirstUser = create<FirstUserState>()(
    devtools(
        (set) => ({
            isFirstUser: true,
            setIsFirstUser: (isFirstUser) => set({ isFirstUser: isFirstUser }),
        }),
        {
            name: 'firstUser-store',
        },
    ),
);

export default useFirstUser;
