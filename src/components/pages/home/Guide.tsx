import { css } from '@emotion/react';

import imageLeft from '@/assets/images/ogami_1.png';
import imageRight from '@/assets/images/ogami_2.png';
import theme from '@/styles/theme';

const TITLE = ' 님의 첫 여행을 등록해주세요 🛫';
const DESCRIPTION = '당신의 추억을 티켓으로 만들어주세요.';

interface GuideProps {
    nickname: string;
}

const Guide: React.FC<GuideProps> = ({ nickname }) => (
    <div css={contentContainer}>
        <h1 css={titleStyle}>
            {nickname}
            {TITLE}
        </h1>
        <div css={imageContainer}>
            <img css={imageStyle} src={imageLeft} alt='image-left' />
            <img css={imageStyle} src={imageRight} alt='image-right' />
        </div>
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

const descriptionStyle = css`
    font-size: 12px;
    color: ${theme.colors.primary};
    color: ${theme.colors.descriptionText};
    margin-bottom: 20px;
`;

const imageContainer = css`
    display: flex;
    gap: 8px;
    margin: 12px 0;
`;

const imageStyle = css`
    width: 60px;
    border-radius: 12px;
`;

export default Guide;
