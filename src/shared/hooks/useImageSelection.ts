import { useState } from 'react';

import { MediaFile } from '@/domains/media/types';

export const useImageSelection = () => {
    const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);

    const handler = {
        toggle: (newImage: MediaFile) => {
            const isAlreadySelected = selectedImages?.some((image) => image.mediaFileId === newImage.mediaFileId);

            if (isAlreadySelected) {
                setSelectedImages((prev) => prev?.filter((image) => image.mediaFileId !== newImage.mediaFileId));
            } else {
                setSelectedImages((prev) => [...prev, newImage]);
            }
        },
    };

    return handler;
};
