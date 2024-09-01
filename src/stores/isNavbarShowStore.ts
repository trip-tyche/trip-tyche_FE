import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { NavbarVisibilityState } from '../types/NavbarVisibilityState';

const useNavbarVisibilityStore = create<NavbarVisibilityState>()(
    devtools(
        (set) => ({
            isNavbarVisible: false,
            setNavbarVisibility: (isVisible) => set({ isNavbarVisible: isVisible }),
        }),
        {
            name: 'navbar-visibility-store', // DevTools에서 표시될 스토어 이름
        },
    ),
);

export default useNavbarVisibilityStore;
