import { css } from '@emotion/react';
import Lottie from 'lottie-react';

import { COLORS } from '@/shared/constants/theme';
import animationData from '@/shared/styles/loading-spinner-2.json';

const Spinner = ({ text = '불러오는 중..' }: { text?: string }) => (
    <div css={spinner}>
        <div css={content}>
            <div css={main}>
                <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: 118, height: 118 }} />
                <p css={spinnerText}>{text}</p>
            </div>
        </div>
        <div css={outerOverlay} />
    </div>
);

const spinner = css`
    position: absolute;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
`;

const content = css`
    width: 240px;
    height: 140px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: absolute;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border: 2px solid ${COLORS.TEXT.DESCRIPTION}70;
    border-radius: 16px;
    overflow: hidden;
    z-index: 215;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const main = css`
    margin-top: -36px;
    z-index: 220;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const spinnerText = css`
    margin-top: -12px;
    color: ${COLORS.TEXT.DESCRIPTION};
    font-size: 14px;
    font-weight: bold;
    text-align: center;
`;

const outerOverlay = css`
    width: 100%;
    height: 100dvh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(0, 0, 0, 0.3);
    z-index: 210;
`;

export default Spinner;
