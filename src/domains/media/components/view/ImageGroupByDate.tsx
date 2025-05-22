import { css } from '@emotion/react';
import { Calendar } from 'lucide-react';

import MediaImageGrid from '@/domains/media/components/view/MediaImageGrid';
import { MediaFileMetaData, MediaFileWithDate } from '@/domains/media/types';
import { formatToKorean } from '@/libs/utils/date';

interface ImageGroupByDateProps {
    imageGroup: MediaFileWithDate;
    selectedImages: MediaFileMetaData[];
    onImageClick: () => void;
}

const ImageGroupByDate = ({ imageGroup, selectedImages, onImageClick }: ImageGroupByDateProps) => {
    return (
        <>
            <div
                css={css`
                    margin: 24px 0 16px 0;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                `}
            >
                <Calendar size={20} />
                <h2 css={dateStyle}>{formatToKorean(imageGroup.recordDate.split('T')[0])}</h2>
            </div>
            <MediaImageGrid images={imageGroup.images} selectedImages={selectedImages} onImageClick={onImageClick} />
        </>
    );
};

const dateStyle = css`
    font-weight: 600;
`;

export default ImageGroupByDate;
