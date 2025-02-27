import { useState, useEffect } from 'react';

import { css } from '@emotion/react';

import Spinner from '@/components/common/Spinner';
import { MediaFile, UnlocatedMediaFile } from '@/types/media';

interface ImageGrid1Props {
    imageSize?: number;
    // displayedImages: ImageModel[];
    displayedImages: MediaFile[];
    selectedImages: UnlocatedMediaFile[];
    // selectedImages: ImageModel[];
    onHashtagSelect: (image: UnlocatedMediaFile) => void;
}

const ImageGrid1 = ({ imageSize = 3, displayedImages, selectedImages, onHashtagSelect }: ImageGrid1Props) => {
    const [images, setImages] = useState<MediaFile[]>([]);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

    useEffect(() => {
        setAllImagesLoaded(false);
        setImages(displayedImages);
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
        <div css={gridStyle(imageSize)}>
            {images.map((image, index) => (
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

const gridStyle = (imageSize: number) => css`
    display: grid;
    grid-template-columns: ${imageSize === 1
        ? '100%'
        : imageSize === 3
          ? 'repeat(3, calc(33.333% - 1.333px))'
          : 'repeat(5, calc(20% - 1.6px))'};
    gap: 2px;
    padding: 2px;
`;

const imageContainerStyle = css`
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    aspect-ratio: 1;
    border-radius: 12px;
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

const spinnerStyle = css`
    height: calc(100dvh - 154px);
`;

export default ImageGrid1;
