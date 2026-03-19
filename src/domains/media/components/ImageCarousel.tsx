import React, { useState, useMemo, useCallback, useEffect, useRef, Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselItem from '@/domains/media/components/CarouselItem';
import { MediaFile } from '@/domains/media/types';
import theme from '@/shared/styles/theme';
import { ImageCarouselState } from '@/shared/types';

interface ImageCarouselProps {
    images: MediaFile[];
    carouselState: ImageCarouselState;
    setCarouselState: Dispatch<SetStateAction<ImageCarouselState>>;
}

const CAROUSEL_CONFIG = {
    ZOOM_DELAY_MS: 1000,
    TAP_THRESHOLD_MS: 200,
    SLIDE_SPEED_MS: 1500,
    AUTOPLAY_SPEED_MS: 2000,
} as const;

const ImageCarousel = ({ images, carouselState, setCarouselState }: ImageCarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const SliderComponent = Slider as React.ComponentType<Record<string, unknown>>;

    const sliderRef = useRef<Slider | null>(null);
    const touchStartTimeRef = useRef<number | null>(null);
    const zoomTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider && typeof slider.slickPlay === 'function' && typeof slider.slickPause === 'function') {
            if (carouselState === 'auto') {
                slider.slickPlay();
            } else {
                slider.slickPause();
            }
        }
    }, [carouselState]);

    useEffect(
        () => () => {
            if (zoomTimerRef.current) {
                clearTimeout(zoomTimerRef.current);
            }
        },
        [],
    );

    const handleSlideClick = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if ('touches' in event) {
                event.preventDefault();
            }

            if (zoomTimerRef.current) {
                clearTimeout(zoomTimerRef.current);
                zoomTimerRef.current = null;
            }

            setCarouselState((prevState) => {
                let newState: ImageCarouselState;
                if (prevState === 'auto') {
                    newState = 'paused';
                    zoomTimerRef.current = setTimeout(() => {
                        setCarouselState('zoomed');
                    }, CAROUSEL_CONFIG.ZOOM_DELAY_MS);
                } else if (prevState === 'paused') {
                    newState = 'auto';
                } else {
                    newState = 'auto';
                }
                return newState;
            });
        },
        [setCarouselState],
    );

    const handleTouchStart = useCallback(() => {
        touchStartTimeRef.current = Date.now();
    }, []);

    const handleTouchEnd = useCallback(
        (event: React.TouchEvent) => {
            if (touchStartTimeRef.current && Date.now() - touchStartTimeRef.current < CAROUSEL_CONFIG.TAP_THRESHOLD_MS) {
                handleSlideClick(event);
            }
            touchStartTimeRef.current = null;
        },
        [handleSlideClick],
    );

    const carouselOptions = useMemo(
        () => ({
            centerMode: carouselState !== 'zoomed',
            infinite: false,
            slidesToShow: 1,
            speed: CAROUSEL_CONFIG.SLIDE_SPEED_MS,
            autoplay: carouselState === 'auto',
            autoplaySpeed: CAROUSEL_CONFIG.AUTOPLAY_SPEED_MS,
            pauseOnHover: false,
            pauseOnFocus: true,
            dots: false,
            arrows: false,
            swipe: true,
            draggable: true,
            beforeChange: (_: number, next: number) => setCurrentSlide(next),
            afterChange: () => {
                if (carouselState === 'paused') {
                    setCarouselState('auto');
                }
            },
        }),
        [carouselState, setCarouselState],
    );

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label="여행 사진 갤러리"
        >
            <SliderComponent {...carouselOptions} css={carouselStyle}>
                {images.map((image, index) => (
                    <div
                        key={image.mediaFileId}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${images.length}장 중 ${index + 1}번째 사진`}
                        onClick={handleSlideClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <CarouselItem
                            image={image}
                            isCurrent={index === currentSlide}
                            isZoomed={carouselState === 'zoomed' && index === currentSlide}
                        />
                    </div>
                ))}
            </SliderComponent>
        </div>
    );
};

const carouselStyle = css`
    background-color: ${theme.COLORS.BACKGROUND.BLACK};
    cursor: pointer;
`;

export default ImageCarousel;
