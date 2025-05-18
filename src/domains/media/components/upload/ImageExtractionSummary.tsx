import { css } from '@emotion/react';
import { MapPin } from 'lucide-react';

import { COLORS } from '@/shared/constants/style';

interface ImageExtractionSummaryProps {
    title: string;
    icon?: React.ReactNode;
    extractSuccessCount: number;
    extractFailCount: number;
}

const ImageExtractionSummary = ({
    title,
    icon = <MapPin size={16} color={COLORS.ICON.DEFAULT} />,
    extractSuccessCount,
    extractFailCount,
}: ImageExtractionSummaryProps) => {
    return (
        <div css={container}>
            <div css={header}>
                {icon}
                <p css={titleStyle}>{title}</p>
            </div>

            <p css={contentStyle}>
                <span css={extractSuccessStyle}>{extractSuccessCount}장</span>
                추출 성공
            </p>
            <p css={extractFailStyle}>{extractFailCount}장 누락</p>
        </div>
    );
};

const container = css`
    width: 100%;
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 8px;
    font-size: 14px;
`;

const header = css`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const titleStyle = css`
    font-weight: 500;
`;

const contentStyle = css`
    margin: 6px 0;
    display: flex;
    gap: 4px;
    color: #4b5563;
`;

const extractSuccessStyle = css`
    color: ${COLORS.TEXT.SUCCESS};
    font-weight: 500;
`;

const extractFailStyle = css`
    font-size: 12px;
    color: ${COLORS.TEXT.ERROR};
`;

export default ImageExtractionSummary;
