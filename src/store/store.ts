import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BearState } from '../types/store';

const useStore = create<BearState>()(
  devtools(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    })
  )
);

export default useStore;
