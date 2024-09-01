import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { BearState } from '../types/store';

const useStore = create<BearState>()(
    devtools(
        (set) => ({
            bears: 0,
            increase: (by) => set((state) => ({ bears: state.bears + by })),
            // setIsLogin: (value) => set({ isLogin: value }),
            // set은 Zustand에서 제공하는 함수로, 스토어의 상태를 업데이트하는 데 사용
            // { isLogin: isLogin }과 동일
        }),
        {
            name: '-store', // DevTools에서 표시될 스토어 이름
        },
    ),
);

export default useStore;
