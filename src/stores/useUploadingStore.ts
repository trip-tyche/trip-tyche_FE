import { create } from 'zustand';

type UploadStatus = 'idle' | 'pending' | 'completed' | 'error';

interface UploadingStore {
    uploadStatus: UploadStatus;
    setUploadStatus: (status: UploadStatus) => void;
    resetUpload: () => void;
    waitForCompletion: () => Promise<void>;
}

export const useUploadStore = create<UploadingStore>((set, get) => ({
    uploadStatus: 'idle',
    setUploadStatus: (status) => set({ uploadStatus: status }),
    resetUpload: () => set({ uploadStatus: 'idle' }),
    waitForCompletion: () =>
        new Promise((resolve) => {
            const checkStatus = () => {
                const status = get().uploadStatus;
                if (status === 'completed' || status === 'error') {
                    resolve();
                } else {
                    setTimeout(checkStatus, 500);
                }
            };
            checkStatus();
        }),
}));
