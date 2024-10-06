import React, { useState } from 'react';

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
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        className: 'center',
        centerMode: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1000,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 500,
        pauseOnHover: true,
        dots: false,
        arrows: false,
        beforeChange: (current: number, next: number) => setCurrentSlide(next),
    };

    return (
        <div css={carouselStyle}>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={img.mediaFileId}>
                        <div css={[slideItemStyle, index === currentSlide ? centerSlideStyle : null]}>
                            <div css={imageWrapper}>
                                <img src={img.mediaLink} alt={`Slide ${img.mediaFileId}`} css={imageStyle} />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const carouselStyle = css`
    width: 100%;
    /* height: calc(100vh - 54px); */
    height: 100vh;
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
    position: relative;
    transform: scale(1);
    opacity: 1;
    /* z-index: 100; */
`;

const imageWrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: calc(100vh - 54px); */
    height: 100vh;
`;

const imageStyle = css`
    max-width: 100%;
    max-height: 100%;

    /* width: 100vw; */
    /* max-width: 428px; */
    /* height: calc(100vh - 54px); */
    object-fit: contain;
`;

export default ImageCarousel;
