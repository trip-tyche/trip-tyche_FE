import { create } from 'zustand';

interface PendingShareRequest {
    senderNickname: string;
    description: string;
}

interface ShareModalProps {
    isModalOpen: boolean;
    senderNickname: string;
    description: string;
    pendingShareRequest: PendingShareRequest | null;
    openModal: (senderNickname: string, description: string) => void;
    closeModal: () => void;
    setPendingShareRequest: (data: PendingShareRequest | null) => void;
}

export const useShareModalStore = create<ShareModalProps>((set) => ({
    isModalOpen: false,
    senderNickname: '',
    description: '',
    pendingShareRequest: null,
    openModal: (senderNickname: string, description: string) =>
        set({
            isModalOpen: true,
            senderNickname,
            description,
        }),
    closeModal: () =>
        set({
            isModalOpen: false,
            senderNickname: '',
            description: '',
        }),
    setPendingShareRequest: (data: PendingShareRequest | null) =>
        set({ pendingShareRequest: data }),
}));
