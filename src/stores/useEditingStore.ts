import { create } from 'zustand';

interface EditingStore {
    isEditing: boolean;
    setIsEditing: (status: boolean) => void;
}

export const useEditingStore = create<EditingStore>((set, get) => ({
    isEditing: false,
    setIsEditing: (status) => set({ isEditing: status }),
}));
