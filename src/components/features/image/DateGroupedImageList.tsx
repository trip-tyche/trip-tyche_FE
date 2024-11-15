import { css } from '@emotion/react';

import ImageGrid from '@/components/pages/addLocation/ImageGrid';
import { ImageModel } from '@/types/image';
import { formatDateToKorean } from '@/utils/date';

interface DateGroupedImageListProps {
    groupedImages: [string, ImageModel[]][];
    selectedImages: ImageModel[];
    toggleImageSelect: (image: ImageModel) => void;
}

const DateGroupedImageList: React.FC<DateGroupedImageListProps> = ({
    groupedImages,
    selectedImages,
    toggleImageSelect,
}) => (
    <div css={listContainerStyle}>
        {groupedImages.map(([date, images]) => (
            <div key={date} css={dateGroupStyle}>
                <h2 css={dateHeaderStyle}>{formatDateToKorean(date)}</h2>
                <ImageGrid
                    displayedImages={images}
                    selectedImages={selectedImages}
                    toggleImageSelect={toggleImageSelect}
                />
            </div>
        ))}
    </div>
);

const listContainerStyle = css`
    overflow-y: auto;
    max-height: calc(100vh - 60px);
`;

const dateGroupStyle = css`
    margin-bottom: 20px;
`;

const dateHeaderStyle = css`
    font-size: 18px;
    font-weight: 600;
    height: 44px;
    display: flex;
    align-items: center;
    padding-left: 8px;
    background-color: #eee;
    border: 1px solid #ccc;
`;

export default DateGroupedImageList;
