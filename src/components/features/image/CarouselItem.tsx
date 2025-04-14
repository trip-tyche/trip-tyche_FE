import React from 'react';

import { css } from '@emotion/react';

import { ImageCarouselModel } from '@/domain/media/image';

interface CarouselItemProps {
    image: ImageCarouselModel;
    isCurrent: boolean;
    isZoomed: boolean;
}

const CarouselItem = React.memo(({ image, isCurrent, isZoomed }: CarouselItemProps) => {
    return (
        <div css={[carouselItemStyle, isCurrent && centerImageStyle, isZoomed && zoomedStyle]}>
            <img src={image.mediaLink} alt={`이미지 ${image.mediaFileId}`} css={imageStyle(isZoomed)} />
        </div>
    );
});
const carouselItemStyle = css`
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.8);
    transition:
        transform 0.3s,
        opacity 0.3s;
    opacity: 0.5;
`;

const centerImageStyle = css`
    transform: scale(1.1);
    opacity: 1;
`;

const zoomedStyle = css`
    transform: scale(1);
`;

const imageStyle = (isZoomed: boolean) => css`
    width: 100%;
    height: ${isZoomed && '100%'};
    aspect-ratio: 1;
    border-radius: 8px;
    object-fit: ${isZoomed ? 'contain' : 'cover'};
`;

export default CarouselItem;
