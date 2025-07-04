import { useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { MediaFile } from '@/domains/media/types';
import { FONT_SIZES } from '@/shared/constants/style';

interface ImageItemProps {
    image: MediaFile;
    onImageLoad?: () => void;
}

const ImageItem = ({ image, onImageLoad }: ImageItemProps) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
        onImageLoad?.();
    }, [onImageLoad]);

    return (
        <div css={imageItemStyle}>
            <img src={image.mediaLink} alt={`이미지 ${image.mediaFileId}`} onLoad={handleImageLoad} css={imageStyle} />
            {!isLoading && <p css={timeStampStyle}>{image.recordDate.split('T')[1]}</p>}
        </div>
    );
};

const imageItemStyle = css`
    margin-bottom: 12px;
    position: relative;
    width: 100%;
    pointer-events: none;
`;

const imageStyle = css`
    width: 100%;
`;

const timeStampStyle = css`
    z-index: 2;
    position: absolute;
    bottom: 12px;
    right: 12px;
    margin: 0;
    padding: 2px 4px;
    font-family: 'DS-DIGII', sans-serif;
    font-weight: bold;
    font-style: italic;
    font-size: ${FONT_SIZES.XL};
    color: #ff9b37;
    letter-spacing: 1px;
    opacity: 0.95;

    text-shadow:
        0 0 5px rgba(255, 155, 55, 0.7),
        0 0 10px rgba(255, 155, 55, 0.5),
        0 0 15px rgba(255, 155, 55, 0.3),
        1px 1px 2px rgba(0, 0, 0, 0.1);

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: rgba(0, 0, 0, 0.05);
        filter: blur(4px);
        z-index: -1;
        border-radius: 4px;
    }
`;

export default ImageItem;
