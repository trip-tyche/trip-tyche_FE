import { useCallback, useEffect, useRef } from 'react';

import { LatLngLiteralType } from '@/types/googleMaps';
import { MediaFile } from '@/types/trip';

export const useImagesLocationObserver = (
    imagesByDate: MediaFile[],
    setImageLocation: (location: LatLngLiteralType) => void,
) => {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                    const image = imagesByDate[index];
                    if (image) {
                        setImageLocation({ lat: image.latitude, lng: image.longitude });
                    }
                }
            });
        },
        [imagesByDate, setImageLocation],
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
    }, [observerCallback, imagesByDate]);

    return imageRefs;
};
