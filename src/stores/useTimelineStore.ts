import { create } from 'zustand';

interface TimelineStore {
    lastPinPointId: string | null;
    setLastPinPointId: (id: string | undefined) => void;
}

const useTimelineStore = create<TimelineStore>((set) => ({
    lastPinPointId: null,
    setLastPinPointId: (id) => set({ lastPinPointId: id }),
}));

export default useTimelineStore;
