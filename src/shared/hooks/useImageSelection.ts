import { useEffect, useState } from 'react';

import { MediaFile } from '@/domains/media/types';

export const useImageSelection = () => {
    const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        if (!isSelectionMode) {
            handlers.clearImages();
        }
    }, [isSelectionMode]);

    const handlers = {
        toggleImage: (newImage: MediaFile) => {
            const isAlreadySelected = selectedImages?.some((image) => image.mediaFileId === newImage.mediaFileId);

            if (isAlreadySelected) {
                setSelectedImages((prev) => prev?.filter((image) => image.mediaFileId !== newImage.mediaFileId));
            } else {
                setSelectedImages((prev) => [...prev, newImage]);
            }
        },
        clearImages: () => setSelectedImages([]),
        onSelectionMode: () => setIsSelectionMode(true),
        offSelectionMode: () => {
            setIsSelectionMode(false);
            setSelectedImages([]);
        },
    };

    return {
        handlers,
        selectedImages,
        isSelectionMode,
    };
};
