import { css } from '@emotion/react';

import mapImage from '@/assets/images/map-image.png';
import theme from '@/styles/theme';

interface noDataImagesCountProps {
    noDataImagesCount: number;
}

const TITLE = ' 개의 사진이 날짜 또는 위치 정보가 없습니다 😢';
const DESCRIPTION = '위치 정보가 없는 사진은 직접 위치를 설정할 수 있습니다.';

const NoDataImageContent: React.FC<noDataImagesCountProps> = ({ noDataImagesCount }) => (
    <div css={contentContainer}>
        <h1 css={titleStyle}>
            <span css={countStyle}>{noDataImagesCount}</span>
            {TITLE}
        </h1>
        <img css={imageStyle} src={mapImage} alt='map-image' />
        <p css={descriptionStyle}>{DESCRIPTION}</p>
    </div>
);

const contentContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
`;

const titleStyle = css`
    font-size: 16px;
    font-weight: 600;
    color: #181818;
`;

const countStyle = css`
    font-size: 18px;
    font-weight: 600;
    color: ${theme.colors.primary};
`;

const descriptionStyle = css`
    font-size: 12px;
    color: ${theme.colors.primary};
    color: #5e5e5e;
    margin-bottom: 20px;
`;

const imageStyle = css`
    width: 85%;
    border: 1px solid ${theme.colors.borderColor};
    border-radius: 12px;
`;

export default NoDataImageContent;
