// import { create } from 'zustand';

// interface ModalProps {
//     isModalOpen: boolean;
//     openModal: (referenceId: number) => void;
//     closeModal: () => void;
// }

// export const useModalStore = create<ModalProps>((set) => ({
//     isModalOpen: false,
//     openModal: () => set({ isModalOpen: true }),
//     closeModal: () => set({ isModalOpen: false }),
// }));

import { create } from 'zustand';

interface ModalProps {
    isModalOpen: boolean;
    senderNickname: string;
    description: string;
    openModal: (senderNickname: string, description: string) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalProps>((set) => ({
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
