import { css } from '@emotion/react';

import ImageGrid from '@/components/pages/addLocation/ImageGrid';
import { formatDateToKorean } from '@/utils/date';

interface ImageWithDate {
    file: File;
    formattedDate: string; // YYYY-MM-DD 형식
}

interface DateGroupedImageListProps {
    groupedImages: [string, ImageWithDate[]][];
    selectedImages: ImageWithDate[];
    toggleImageSelection: (image: ImageWithDate) => void;
}

const DateGroupedImageList: React.FC<DateGroupedImageListProps> = ({
    groupedImages,
    selectedImages,
    toggleImageSelection,
}) => (
    <div css={listContainerStyle}>
        {groupedImages.map(([date, images]) => (
            <div key={date} css={dateGroupStyle}>
                <h2 css={dateHeaderStyle}>{formatDateToKorean(date)}</h2>
                <ImageGrid
                    displayedImages={images}
                    selectedImages={selectedImages}
                    toggleImageSelection={toggleImageSelection}
                />
            </div>
        ))}
    </div>
);

const listContainerStyle = css`
    overflow-y: auto;
    max-height: calc(100vh - 200px); // 적절한 높이로 조정하세요
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
