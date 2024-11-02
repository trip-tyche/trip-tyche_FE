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
        new Promise((resolve, reject) => {
            const checkStatus = () => {
                const status = get().uploadStatus;
                if (status === 'completed') {
                    resolve();
                } else if (status === 'error') {
                    reject(new Error('Upload failed'));
                } else {
                    setTimeout(checkStatus, 500); // 500ms마다 상태 체크
                }
            };
            checkStatus();
        }),
}));
