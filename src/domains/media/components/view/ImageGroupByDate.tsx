import { useCallback, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { Calendar } from 'lucide-react';

import ImageCard from '@/domains/media/components/upload/ImageCard';
import { MediaFile } from '@/domains/media/types';
import { formatToKorean } from '@/libs/utils/date';
import { hasValidDate } from '@/libs/utils/validate';

interface ImageGroupByDateProps {
    imageGroup: {
        recordDate: string;
        images: MediaFile[];
    };
    selectedImages: MediaFile[];
    onImageClick: (selectedImage: MediaFile) => void;
    onLoad: () => void;
}

const ImageGroupByDate = ({ imageGroup, selectedImages, onImageClick, onLoad }: ImageGroupByDateProps) => {
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);

    const loadedImageCount = useRef(0);

    useEffect(() => {
        if (isImagesLoaded) {
            onLoad();
        }
    }, [isImagesLoaded, onLoad]);

    const handleAllImagesLoad = useCallback(() => {
        loadedImageCount.current += 1;
        if (loadedImageCount.current === imageGroup.images.length) {
            setIsImagesLoaded(true);
        }
    }, []);

    const hasDate = hasValidDate(imageGroup.recordDate);

    return (
        <div css={container}>
            {hasDate && (
                <div css={header}>
                    <Calendar size={20} />
                    <h2 css={dateStyle}>{formatToKorean(imageGroup.recordDate.split('T')[0])}</h2>
                </div>
            )}
            <div css={mainStyle}>
                {imageGroup.images.map((image) => {
                    const isSelected = selectedImages.some(
                        (selectedImage) => selectedImage.mediaFileId === image.mediaFileId,
                    );

                    return (
                        <div key={image.mediaFileId} onClick={() => onImageClick(image)}>
                            <ImageCard image={image} isSelected={isSelected} isTimeView onLoad={handleAllImagesLoad} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const container = css`
    margin-top: 24px;
`;

const header = css`
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const dateStyle = css`
    font-weight: 600;
`;

const mainStyle = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
`;

export default ImageGroupByDate;
