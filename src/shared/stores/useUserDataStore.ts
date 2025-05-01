import { create } from 'zustand';

interface UserDataState {
    userNickName: string | null;
    tripTicketCount: number;
    isTripInfoEditing: boolean;
    setUserNickName: (userNickName: string) => void;
    setTripTicketCount: (tripTicketCount: number) => void;
    deleteTripTicket: () => void;
    setIsTripInfoEditing: (isTripInfoEditing: boolean) => void;
}

const useUserDataStore = create<UserDataState>((set) => ({
    userNickName: null,
    tripTicketCount: 0,
    isTripInfoEditing: false,
    setUserNickName: (userNickName) => {
        set({ userNickName });
    },
    setTripTicketCount: (tripTicketCount) => {
        set({ tripTicketCount });
    },
    deleteTripTicket: () => set((state) => ({ tripTicketCount: state.tripTicketCount - 1 })),
    setIsTripInfoEditing: (isTripInfoEditing) => set({ isTripInfoEditing }),
}));

export default useUserDataStore;
