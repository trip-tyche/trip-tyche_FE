// import { useEffect, useState } from 'react';

// import { css } from '@emotion/react';
// import { GoCheckCircleFill } from 'react-icons/go';

// interface ImageGridProps {
//     displayedImages: File[];
//     selectedImages: File[];
//     toggleImageSelection: (image: File) => void;
// }

// const ImageGrid = ({ displayedImages, selectedImages, toggleImageSelection }: ImageGridProps): JSX.Element => {
//     const [imageUrls, setImageUrls] = useState<string[]>([]);

//     useEffect(() => {
//         const urls = displayedImages.map((image) => URL.createObjectURL(image));
//         setImageUrls(urls);
//         return () => {
//             urls.forEach((url) => URL.revokeObjectURL(url));
//         };
//     }, [displayedImages]);

//     return (
//         <div css={gridStyle}>
//             {imageUrls.map((url, index) => (
//                 <div key={url} css={imageContainerStyle} onClick={() => toggleImageSelection(displayedImages[index])}>
//                     <img src={url} alt={`image-${index}`} css={imageStyle} />
//                     {selectedImages.some((file) => file.name === displayedImages[index].name) && (
//                         <div css={selectedOverlayStyle}>
//                             <GoCheckCircleFill css={checkIconStyle} />
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// };

// const gridStyle = css`
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 4px;
//     overflow: auto;
// `;

// const imageContainerStyle = css`
//     position: relative;
//     aspect-ratio: 1;
//     overflow: hidden;
//     cursor: pointer;
// `;

// const imageStyle = css`
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
// `;

// const selectedOverlayStyle = css`
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(0, 0, 0, 0.5);
//     display: flex;
//     justify-content: flex-end;
//     padding: 10px;
// `;

// const checkIconStyle = css`
//     color: white;
//     font-size: 20px;
// `;

// export default ImageGrid;

import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { GoCheckCircleFill } from 'react-icons/go';

import Spinner from '@/components/common/Spinner';
import { ImageModel } from '@/types/image';

interface ImageGridProps {
    displayedImages: ImageModel[];
    selectedImages: ImageModel[];
    toggleImageSelect: (image: ImageModel) => void;
}

const ImageGrid = ({ displayedImages, selectedImages, toggleImageSelect }: ImageGridProps) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    useEffect(() => {
        const urls = displayedImages.map((image) => URL.createObjectURL(image.image));
        setImageUrls(urls);
        setLoadedImages(new Array(urls.length).fill(false));
        setAllImagesLoaded(false);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [displayedImages]);

    useEffect(() => {
        if (loadedImages.every((loaded) => loaded)) {
            setAllImagesLoaded(true);
        }
    }, [loadedImages]);

    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => {
            const newLoadedImages = [...prev];
            newLoadedImages[index] = true;
            return newLoadedImages;
        });
    };

    if (!allImagesLoaded) {
        return (
            <div css={loadingContainerStyle}>
                <Spinner />
            </div>
        );
    }

    return (
        <div css={gridStyle}>
            {imageUrls.map((url, index) => (
                <div key={url} css={imageContainerStyle} onClick={() => toggleImageSelect(displayedImages[index])}>
                    <img src={url} alt={`image-${index}`} css={imageStyle} onLoad={() => handleImageLoad(index)} />
                    {selectedImages.some(
                        (selectedImage) => selectedImage.image.name === displayedImages[index].image.name,
                    ) && (
                        <div css={selectedOverlayStyle}>
                            <GoCheckCircleFill css={checkIconStyle} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(32%, 1fr));
    gap: 4px;
    padding: 4px;
`;

const imageContainerStyle = css`
    position: relative;
    aspect-ratio: 1;
    cursor: pointer;
`;

const imageStyle = css`
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
`;

const selectedOverlayStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
`;

const checkIconStyle = css`
    color: white;
    font-size: 24px;
`;

const loadingContainerStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

export default ImageGrid;
