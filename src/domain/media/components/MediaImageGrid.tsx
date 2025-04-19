import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { GoCheckCircleFill } from 'react-icons/go';

import Spinner from '@/components/common/Spinner';
import { COLORS } from '@/constants/theme';
import { MediaFileMetaData } from '@/domain/media/types';

interface MediaImageGridProps {
    images: MediaFileMetaData[];
    selectedImages?: MediaFileMetaData[];
    onImageClick?: (image: MediaFileMetaData) => void;
}

const MediaImageGrid = ({ images, selectedImages, onImageClick }: MediaImageGridProps) => {
    const [displayedImages, setDisplayedImagesmages] = useState<MediaFileMetaData[]>([]);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

    useEffect(() => {
        setAllImagesLoaded(false);
        setDisplayedImagesmages(images);
    }, []);

    useEffect(() => {
        if (loadedImages.every((loaded) => loaded)) {
            setAllImagesLoaded(true);
        }
    }, [loadedImages, setAllImagesLoaded]);

    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => {
            const newLoadedImages = [...prev];
            newLoadedImages[index] = true;
            return newLoadedImages;
        });
    };

    if (!allImagesLoaded) {
        return <Spinner />;
    }

    return (
        <div css={gridStyle}>
            {displayedImages.map((image, index) => (
                <div key={image.mediaFileId} css={imageContainerStyle} onClick={() => onImageClick?.(image)}>
                    <img
                        src={image.mediaLink}
                        alt={`여행 사진 ${index}`}
                        onLoad={() => handleImageLoad(index)}
                        css={imageStyle}
                    />
                    {selectedImages &&
                        selectedImages.some((selectedImage) => selectedImage.mediaFileId === image.mediaFileId) && (
                            <div css={selectedOverlayStyle}>
                                <span css={checkIconStyle}>
                                    <GoCheckCircleFill size={24} color={COLORS.PRIMARY} />
                                </span>
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
};

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(3, calc(33.333% - 1.333px));
    gap: 2px;
    padding: 2px;
`;

const imageContainerStyle = css`
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    aspect-ratio: 1;
    border-radius: 6px;
    overflow: hidden;
`;

const imageStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const selectedOverlayStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: end;
    justify-content: end;
    padding: 12px;
`;

const checkIconStyle = css`
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background-color: white;
`;

export default MediaImageGrid;
