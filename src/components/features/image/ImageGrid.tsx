import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { GoCheckCircleFill } from 'react-icons/go';

import Spinner from '@/components/common/Spinner';
import theme from '@/styles/theme';
import { ImageModel } from '@/types/image';

interface ImageGridProps {
    imageSize: number;
    displayedImages: ImageModel[];
    selectedImages: ImageModel[];
    onHashtagSelect: (image: ImageModel) => void;
}

const ImageGrid = ({ imageSize, displayedImages, selectedImages, onHashtagSelect }: ImageGridProps) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

    useEffect(() => {
        setAllImagesLoaded(false);
    }, []);

    useEffect(() => {
        const blobUrls = displayedImages.map((image) => URL.createObjectURL(image.image));
        setImageUrls(blobUrls);
        setLoadedImages(new Array(blobUrls.length).fill(false));
        setAllImagesLoaded(false);

        return () => {
            blobUrls.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
        };
    }, [displayedImages, setAllImagesLoaded]);

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
            {imageUrls.map((imageUrl, index) => (
                <div key={imageUrl} css={imageContainerStyle} onClick={() => onHashtagSelect(displayedImages[index])}>
                    <img
                        src={imageUrl}
                        alt={`이미지-${index}`}
                        onLoad={() => handleImageLoad(index)}
                        css={imageStyle}
                    />
                    {selectedImages.some(
                        (selectedImage) => selectedImage.image.name === displayedImages[index].image.name,
                    ) && (
                        <div css={selectedOverlayStyle}>
                            <span css={checkIconStyle}>
                                <GoCheckCircleFill size={24} color={theme.colors.primary} />
                            </span>
                        </div>
                    )}
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
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
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

export default ImageGrid;
