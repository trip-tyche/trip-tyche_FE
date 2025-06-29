import { useCallback, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { Calendar } from 'lucide-react';

import ImageCard from '@/domains/media/components/upload/ImageCard';
import { MediaFile } from '@/domains/media/types';
import { formatToKorean } from '@/libs/utils/date';
import { hasValidDate } from '@/libs/utils/validate';

interface ImageGroupByDateProps {
    imageGroup: { recordDate: string; images: MediaFile[] };
    selectedImages: MediaFile[];
    onImageClick: (selectedImage: MediaFile) => void;
    onLoad: () => void;
}

const ImageGroupByDate = ({ imageGroup, selectedImages, onImageClick, onLoad }: ImageGroupByDateProps) => {
    const { images, recordDate } = imageGroup;
    const imageCount = images.length || 0;

    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const loadedImageCount = useRef(0);

    useEffect(() => {
        if (isImagesLoaded) {
            onLoad();
        }
    }, [isImagesLoaded, onLoad]);

    const handleAllImagesLoad = useCallback(() => {
        loadedImageCount.current += 1;
        if (loadedImageCount.current === imageCount) {
            setIsImagesLoaded(true);
        }
    }, [imageCount]);

    const hasDate = hasValidDate(recordDate);
    const sortedImages = images.sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

    return (
        <div css={container}>
            {hasDate && (
                <div css={header}>
                    <Calendar size={20} />
                    <h2 css={dateStyle}>{formatToKorean(recordDate.split('T')[0])}</h2>
                </div>
            )}
            <div css={mainStyle}>
                {sortedImages.map((image) => {
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
