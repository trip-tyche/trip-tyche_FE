import { RefObject, useEffect, useState } from 'react';

export const useScrollHint = (imageListRef: RefObject<HTMLDivElement>, isLoaded: boolean, isImageLoaded: boolean) => {
    const [isHintOverlayVisible, setIsHintOverlayVisible] = useState(false);

    const scrollFirstLoad = (element: HTMLElement, target: number, duration: number) => {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeInOutCubic =
                progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            element.scrollTop = start + change * easeInOutCubic;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    useEffect(() => {
        if (isLoaded && isImageLoaded && imageListRef.current) {
            setIsHintOverlayVisible(true);

            const element = imageListRef.current;
            const scrollDown = () => scrollFirstLoad(element, 80, 1000);
            const scrollUp = () => scrollFirstLoad(element, 0, 1000);

            const hideHint = () => {
                setIsHintOverlayVisible(false);
            };

            const timeoutIds = [setTimeout(scrollDown, 100), setTimeout(scrollUp, 1500), setTimeout(hideHint, 2500)];

            return () => {
                timeoutIds.forEach(clearTimeout);
            };
        }
    }, [isLoaded, isImageLoaded, imageListRef]);

    return { isHintOverlayVisible };
};
