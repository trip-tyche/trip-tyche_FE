import React, { useState } from 'react';

import { css } from '@emotion/react';

const carouselStyles = css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const slideContainerStyles = css`
    display: flex;
    transition: transform 0.3s ease-in-out;
`;

const slideStyles = css`
    position: relative;
    width: 60%;
    height: 100vh;
    flex-shrink: 0;
`;

const imageStyles = css`
    position: absolute;
    top: 0;
    left: 0;
    /* width: 80%; */
    height: 100%;
    object-fit: cover;
    transition:
        opacity 0.3s,
        transform 0.3s;
`;

const buttonStyles = css`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    border-radius: 50%;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.8);
    }
`;

interface ImageProps {
    images: string[];
}

const ImageCarousel = ({ images }: ImageProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div css={carouselStyles}>
            <div
                css={[
                    slideContainerStyles,
                    css`
                        transform: translateX(-${currentIndex * 100}%);
                        width: ${images.length * 100}%;
                    `,
                ]}
            >
                {images.map((image, index) => (
                    <div key={index} css={slideStyles}>
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            css={[
                                imageStyles,
                                css`
                                    opacity: ${index === currentIndex ? 1 : 0.5};
                                    transform: scale(${index === currentIndex ? 1 : 0.8});
                                `,
                            ]}
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={prevSlide}
                css={[
                    buttonStyles,
                    css`
                        left: 20px;
                    `,
                ]}
            >
                &#10094;
            </button>
            <button
                onClick={nextSlide}
                css={[
                    buttonStyles,
                    css`
                        right: 20px;
                    `,
                ]}
            >
                &#10095;
            </button>
        </div>
    );
};

export default ImageCarousel;
