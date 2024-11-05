import { create } from 'zustand';

interface TimelineStore {
    currentPinPointId: string | null;
    setCurrentPinPointId: (id: string | undefined) => void;
}

const useTimelineStore = create<TimelineStore>((set) => ({
    currentPinPointId: null,
    setCurrentPinPointId: (id) => set({ currentPinPointId: id }),
}));

export default useTimelineStore;
