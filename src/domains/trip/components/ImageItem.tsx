import { css } from '@emotion/react';

import { MediaFileModel } from '@/domains/media/types';
import theme from '@/styles/theme';

interface ImageItemProps {
    image: MediaFileModel;
    index: number;
    onImageLoad: () => void;
    isImageLoaded: boolean;
    reference: (element: HTMLDivElement | null) => void;
}

const ImageItem = ({ image, index, onImageLoad, isImageLoaded, reference }: ImageItemProps) => {
    return (
        <div ref={reference} css={imageItemStyle} data-index={index}>
            <img src={image.mediaLink} alt={`이미지 ${image.mediaFileId}`} onLoad={onImageLoad} css={imageStyle} />
            {isImageLoaded && <p css={timeStampStyle}>{image.recordDate.split('T')[1]}</p>}
        </div>
    );
};

const imageItemStyle = css`
    margin-bottom: 12px;
    position: relative;
    padding: 0 20px;
    width: 100%;
`;

const imageStyle = css`
    width: 100%;
`;

const timeStampStyle = css`
    z-index: 2;
    position: absolute;
    bottom: 8px;
    right: 30px;
    margin: 0;
    padding: 2px 4px;
    font-family: 'DS-DIGII', sans-serif;
    font-weight: bold;
    font-style: italic;
    font-size: ${theme.FONT_SIZES.XL};
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
