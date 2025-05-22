import { css } from '@emotion/react';
import { Calendar, Map } from 'lucide-react';

import { ImageFileWithAddress } from '@/domains/media/types';
import { formatKoreanDate } from '@/libs/utils/date';
import { hasValidDate } from '@/libs/utils/validate';
import { COLORS } from '@/shared/constants/style';

interface ImageCardProps {
    image: ImageFileWithAddress;
    isSelected?: boolean;
    onClick?: () => void;
}

const ImageCard = ({ image, isSelected, onClick }: ImageCardProps) => {
    const address = image.address || '위치 정보 없음';
    const date = hasValidDate(image.recordDate) ? formatKoreanDate(image.recordDate, true) : '날짜 정보 없음';
    const hasAddress = !!image.address;
    const hasDate = hasValidDate(image.recordDate);

    return (
        <div key={image.imageUrl} css={container} onClick={onClick}>
            <img src={image.imageUrl} alt='여행 사진 카드' css={imageStyle} />
            <div css={infoContainer}>
                <div css={iconStyle}>
                    <Map size={12} />
                    <p css={textStyle(hasAddress)}>{address}</p>
                </div>
                <div css={iconStyle}>
                    <Calendar size={12} />
                    <p css={textStyle(hasDate)}>{date}</p>
                </div>
            </div>
        </div>
    );
};

const container = css`
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-radius: 8px;
    border: 1px solid ${COLORS.BORDER};
    overflow: hidden;
`;

const imageStyle = css`
    width: 100%;
    height: 120px;
    object-fit: cover;
`;

const infoContainer = css`
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const iconStyle = css`
    display: flex;
    align-items: center;
`;

const textStyle = (isValid: boolean) => css`
    margin-left: 4px;
    font-size: 12px;
    color: ${!isValid ? '#ef4444' : '#374151'};
`;

export default ImageCard;
