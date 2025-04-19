import React, { useState, useMemo, useCallback, useEffect, useRef, Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselItem from '@/domains/media/components/CarouselItem';
import { MediaFile } from '@/domains/media/types';
import theme from '@/styles/theme';
import { ImageCarouselState } from '@/types';

interface ImageCarouselProps {
    images: MediaFile[];
    carouselState: ImageCarouselState;
    setCarouselState: Dispatch<SetStateAction<ImageCarouselState>>;
}

const ImageCarousel = ({ images, carouselState, setCarouselState }: ImageCarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

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
                    }, 1000);
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
            if (touchStartTimeRef.current && Date.now() - touchStartTimeRef.current < 200) {
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
            speed: 1500,
            autoplay: carouselState === 'auto',
            autoplaySpeed: 500,
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
        <Slider {...carouselOptions} ref={sliderRef} css={carouselStyle}>
            {images.map((image, index) => (
                <div
                    key={image.mediaFileId}
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
        </Slider>
    );
};

const carouselStyle = css`
    background-color: ${theme.COLORS.BACKGROUND.BLACK};
    cursor: pointer;
`;

export default ImageCarousel;
