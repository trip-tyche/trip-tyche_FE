// import React, { useState, useMemo } from 'react';

// import { css } from '@emotion/react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// interface ImageType {
//     mediaFileId: string;
//     mediaLink: string;
// }

// interface ImageCarouselProps {
//     images: ImageType[];
// }

// const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const settings = useMemo(
//         () => ({
//             className: 'center',
//             centerMode: true,
//             infinite: true,
//             slidesToShow: 1,
//             speed: 1000,
//             focusOnSelect: true,
//             autoplay: true,
//             autoplaySpeed: 500,
//             pauseOnHover: true,
//             dots: false,
//             arrows: false,
//             beforeChange: (_: number, next: number) => setCurrentSlide(next),
//         }),
//         [],
//     );

//     return (
//         <div css={carouselStyle}>
//             <Slider {...settings}>
//                 {images.map((img, index) => (
//                     <div key={img.mediaFileId}>
//                         <SlideItem image={img} isCurrent={index === currentSlide} />
//                     </div>
//                 ))}
//             </Slider>
//         </div>
//     );
// };

// interface SlideItemProps {
//     image: ImageType;
//     isCurrent: boolean;
// }

// const SlideItem: React.FC<SlideItemProps> = React.memo(({ image, isCurrent }) => (
//     <div css={[slideItemStyle, isCurrent && centerSlideStyle]}>
//         <div css={imageWrapper}>
//             <img src={image.mediaLink} alt={`Slide ${image.mediaFileId}`} css={imageStyle} />
//         </div>
//     </div>
// ));

// SlideItem.displayName = 'SlideItem';

// const carouselStyle = css`
//     width: 100%;
//     height: 100vh;
//     background-color: #090909;
//     cursor: pointer;
// `;

// const slideItemStyle = css`
//     transform: scale(0.8);
//     transition:
//         transform 0.3s,
//         opacity 0.3s;
//     opacity: 0.5;
// `;

// const centerSlideStyle = css`
//     transform: scale(1);
//     opacity: 1;
// `;

// const imageWrapper = css`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100vh;
// `;

// const imageStyle = css`
//     max-width: 100%;
//     max-height: 100%;
//     object-fit: contain;
// `;

// export default ImageCarousel;

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import { css } from '@emotion/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageType {
    mediaFileId: string;
    mediaLink: string;
}

interface ImageCarouselProps {
    images: ImageType[];
    onStateChange: (state: CarouselState) => void;
}

type CarouselState = 'auto' | 'paused' | 'zoomed';

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onStateChange }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [carouselState, setCarouselState] = useState<CarouselState>('auto');
    const sliderRef = useRef<Slider | null>(null);
    const touchStartTimeRef = useRef<number | null>(null);
    const zoomTimerRef = useRef<NodeJS.Timeout | null>(null);

    const settings = useMemo(
        () => ({
            className: 'center',
            centerMode: carouselState !== 'zoomed',
            infinite: false,
            slidesToShow: 1,
            speed: 1200,
            autoplay: carouselState === 'auto',
            autoplaySpeed: 500,
            pauseOnHover: false,
            dots: false,
            arrows: false,
            beforeChange: (_: number, next: number) => setCurrentSlide(next),
            swipe: true,
            draggable: true,
            afterChange: () => {
                if (carouselState === 'paused') {
                    setCarouselState('auto');
                }
            },
        }),
        [carouselState],
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
                let newState: CarouselState;
                if (prevState === 'auto') {
                    newState = 'paused';
                    zoomTimerRef.current = setTimeout(() => {
                        setCarouselState('zoomed');
                        onStateChange('zoomed');
                    }, 1000);
                } else if (prevState === 'paused') {
                    newState = 'auto';
                } else {
                    newState = 'auto';
                }
                onStateChange(newState);
                return newState;
            });
        },
        [onStateChange],
    );

    // const handleTouchStart = useCallback((event: React.TouchEvent) => {
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

    return (
        <div css={carouselStyle}>
            <Slider {...settings} ref={sliderRef}>
                {images.map((img, index) => (
                    <div
                        key={img.mediaFileId}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onClick={handleSlideClick}
                    >
                        <SlideItem
                            image={img}
                            isCurrent={index === currentSlide}
                            isZoomed={carouselState === 'zoomed' && index === currentSlide}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

interface SlideItemProps {
    image: ImageType;
    isCurrent: boolean;
    isZoomed: boolean;
}

const SlideItem: React.FC<SlideItemProps> = React.memo(({ image, isCurrent, isZoomed }) => (
    <div css={[slideItemStyle, isCurrent && centerSlideStyle, isZoomed && zoomedStyle]}>
        <div css={imageWrapper}>
            <img src={image.mediaLink} alt={`Slide ${image.mediaFileId}`} css={imageStyle(isZoomed)} />
        </div>
    </div>
));

SlideItem.displayName = 'SlideItem';

const carouselStyle = css`
    width: 100%;
    height: 100dvh;
    background-color: #090909;
    cursor: pointer;
`;

const slideItemStyle = css`
    transform: scale(0.8);
    transition:
        transform 0.3s,
        opacity 0.3s;
    opacity: 0.5;
`;

const centerSlideStyle = css`
    transform: scale(1.1);
    opacity: 1;
`;

const zoomedStyle = css`
    transform: scale(1);
    opacity: 1;
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const imageWrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
`;

const imageStyle = (isZoomed: boolean) => css`
    width: 100%;
    height: ${isZoomed && '100%'};
    aspect-ratio: 1;
    border-radius: 8px;
    object-fit: ${isZoomed ? 'contain' : 'cover'};
`;

export default ImageCarousel;
