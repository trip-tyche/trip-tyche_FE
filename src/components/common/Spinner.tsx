import { css, SerializedStyles } from '@emotion/react';
import Lottie from 'lottie-react';
// import { ClipLoader } from 'react-spinners';

import { COLORS } from '@/constants/theme';
import animationData from '@/styles/loading-spinner-2.json';
// import theme from '@/styles/theme';

type BackgroundType = 'light' | 'dark';
interface SpinnerProps {
    background?: BackgroundType;
    containerStyle?: SerializedStyles;
}

// const Spinner = ({ background = 'light', containerStyle }: SpinnerProps) => (
const Spinner = ({ containerStyle }: SpinnerProps) => (
    <div css={[loadingSpinnerStyle, containerStyle]}>
        {/* <ClipLoader
            color={background === 'light' ? theme.COLORS.TEXT.BLACK : theme.COLORS.TEXT.WHITE}
            size={30}
            speedMultiplier={0.7}
        /> */}
        <div css={content}>
            <div css={main}>
                <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: 118, height: 118 }} />
                <p css={text}>불러오는 중...</p>
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
`;

const main = css`
    margin-top: -36px;
    z-index: 220;
`;

const text = css`
    margin-top: -20px;
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
    background-color: rgb(0, 0, 0, 0.7);
    z-index: 210;
`;

export default Spinner;
