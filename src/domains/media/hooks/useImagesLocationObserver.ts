import { useCallback, useEffect, useRef } from 'react';

import { MediaFile } from '@/domains/media/types';
import { Location } from '@/shared/types/map';

export const useImagesLocationObserver = (images: MediaFile[], setImageLocation: (location: Location) => void) => {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                    const image = images[index];
                    if (image) {
                        setImageLocation({ latitude: image.latitude, longitude: image.longitude });
                    }
                }
            });
        },
        [images, setImageLocation],
    );

    useEffect(() => {
        const refs = imageRefs.current;
        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        });

        refs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            refs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [observerCallback, images]);

    return imageRefs;
};
