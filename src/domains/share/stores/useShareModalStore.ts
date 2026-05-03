import { create } from 'zustand';

interface PendingRequest {
    senderNickname: string;
    description: string;
}

interface ShareModalProps {
    isModalOpen: boolean;
    senderNickname: string;
    description: string;
    isTicketPageReady: boolean;
    pendingRequest: PendingRequest | null;
    openModal: (senderNickname: string, description: string) => void;
    closeModal: () => void;
    // Called by MainPage once trips have loaded — flushes any queued request
    setTicketPageReady: () => void;
    // Used by socket: shows immediately if page is ready, otherwise queues
    queueOrOpen: (senderNickname: string, description: string) => void;
}

export const useShareModalStore = create<ShareModalProps>((set, get) => ({
    isModalOpen: false,
    senderNickname: '',
    description: '',
    isTicketPageReady: false,
    pendingRequest: null,
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
    setTicketPageReady: () => {
        if (get().isTicketPageReady) return;
        const { pendingRequest } = get();
        set({
            isTicketPageReady: true,
            pendingRequest: null,
            ...(pendingRequest
                ? { isModalOpen: true, senderNickname: pendingRequest.senderNickname, description: pendingRequest.description }
                : {}),
        });
    },
    queueOrOpen: (senderNickname: string, description: string) => {
        if (get().isTicketPageReady) {
            set({ isModalOpen: true, senderNickname, description });
        } else {
            set({ pendingRequest: { senderNickname, description } });
        }
    },
}));
