import { css } from '@emotion/react';
import Lottie from 'lottie-react';
// import { ClipLoader } from 'react-spinners';

import { COLORS } from '@/constants/theme';
import animationData from '@/styles/loading-spinner-2.json';
// import theme from '@/styles/theme';

interface SpinnerProps {
    loadingText?: string;
}

const Spinner = ({ loadingText = '불러오는 중...' }: SpinnerProps) => (
    <div css={loadingSpinnerStyle}>
        <div css={content}>
            <div css={main}>
                <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: 118, height: 118 }} />
                <p css={text}>{loadingText}</p>
            </div>
            <div css={overlay} />
        </div>
        <div css={outerOverlay} />
    </div>
);

const loadingSpinnerStyle = css`
    position: absolute;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
`;

const content = css`
    width: 122px;
    height: 122px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const main = css`
    margin-top: -36px;
    z-index: 220;
`;

const text = css`
    margin-top: -18px;
    color: #6a6a6a;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
`;

const overlay = css`
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border: 2px solid #6a6a6a80;
    border-radius: 16px;
    overflow: hidden;
    z-index: 215;
`;

const outerOverlay = css`
    width: 100%;
    height: 100dvh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(0, 0, 0, 0.4);
    z-index: 210;
`;

export default Spinner;
