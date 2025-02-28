import { useState, useEffect } from 'react';

import { css } from '@emotion/react';

import Spinner from '@/components/common/Spinner';
import { MediaFile } from '@/types/media';

interface MediaImageGridProps {
    images: MediaFile[];
}

const MediaImageGrid = ({ images }: MediaImageGridProps) => {
    const [displayedImages, setDisplayedImagesmages] = useState<MediaFile[]>([]);
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
        return <Spinner containerStyle={spinnerStyle} />;
    }

    return (
        <div css={gridStyle}>
            {displayedImages.map((image, index) => (
                <div
                    key={image.mediaFileId}
                    css={imageContainerStyle}
                    // onClick={() => onHashtagSelect(displayedImages[index])}
                >
                    <img
                        src={image.mediaLink}
                        alt={`이미지-${index}`}
                        onLoad={() => handleImageLoad(index)}
                        css={imageStyle}
                    />
                    {/* {selectedImages.some(
                        (selectedImage) => selectedImage.mediaFileId === displayedImages[index].mediaFileId,
                    ) && (
                        <div css={selectedOverlayStyle}>
                            <span css={checkIconStyle}>
                                <GoCheckCircleFill size={24} color={theme.COLORS.PRIMARY} />
                            </span>
                        </div>
                    )} */}
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

const spinnerStyle = css`
    height: calc(100dvh - 154px);
`;

export default MediaImageGrid;
