import { create } from 'zustand';

type UploadStatus = 'idle' | 'pending' | 'completed' | 'error';

interface UploadingStore {
    uploadStatus: UploadStatus;
    setUploadStatus: (status: UploadStatus) => void;
    resetUploadStatus: () => void;
}

export const useUploadStore = create<UploadingStore>((set) => ({
    uploadStatus: 'idle',
    setUploadStatus: (status) => set({ uploadStatus: status }),
    resetUploadStatus: () => set({ uploadStatus: 'idle' }),
}));
