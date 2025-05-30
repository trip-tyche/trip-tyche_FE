import { css } from '@emotion/react';

import Spinner from '@/shared/components/common/Spinner';
import { COLORS } from '@/shared/constants/style';

const Indicator = ({ text = '불러오는 중...' }: { text?: string }) => (
    <>
        <div css={spinner}>
            <Spinner />
            <p css={spinnerText}>{text}</p>
        </div>
        <div css={outerOverlay} />
    </>
);

const spinner = css`
    width: 200px;
    height: 120px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 18px;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border: 2px solid ${COLORS.TEXT.DESCRIPTION}70;
    border-radius: 16px;
    z-index: 9999;
`;

const spinnerText = css`
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
    z-index: 999;
`;

export default Indicator;
