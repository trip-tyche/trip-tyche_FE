import { create } from 'zustand';

interface ShareModalProps {
    isModalOpen: boolean;
    senderNickname: string;
    description: string;
    openModal: (senderNickname: string, description: string) => void;
    closeModal: () => void;
}

export const useShareModalStore = create<ShareModalProps>((set) => ({
    isModalOpen: false,
    senderNickname: '',
    description: '',
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
}));
