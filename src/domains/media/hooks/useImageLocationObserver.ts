import { useCallback, useEffect, useRef } from 'react';

import { MediaFile } from '@/domains/media/types';
import { Location } from '@/shared/types/map';

export const useImageLocationObserver = (images: MediaFile[], onImageLocationChange: (location: Location) => void) => {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    const image = images[index];
                    onImageLocationChange({ latitude: image.latitude, longitude: image.longitude });
                }
            });
        },
        [images, onImageLocationChange],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.6,
        });

        const refs = imageRefs.current;
        refs.forEach((ref) => ref && observer.observe(ref));

        return () => {
            observer.disconnect();
        };
    }, [observerCallback, images]);

    return imageRefs;
};
