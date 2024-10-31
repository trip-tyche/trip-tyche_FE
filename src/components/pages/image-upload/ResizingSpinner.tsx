import { css } from '@emotion/react';

import loadingImage from '@/assets/images/flightLoading5.gif';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import theme from '@/styles/theme';

interface ResizingSpinnerProps {
    earliestDate: string;
    latestDate: string;
}

const ResizingSpinner = ({ earliestDate, latestDate }: ResizingSpinnerProps) => (
    <>
        <ModalOverlay />
        <div css={divStyle}>
            <p css={pStyle}>
                {<span>{earliestDate}</span>} 부터 {<span>{latestDate}</span>}의
            </p>
            <p css={pStyle}>여행 사진에서 사진에서 정보를 찾고 있어요!</p>
            <img src={loadingImage} />
            <p css={pStyle}>
                약 <span>5초</span> 정도 소요됩니다.
            </p>
        </div>
    </>
);

const divStyle = css`
    padding-top: 4px;
    width: 80vw;
    max-width: 360px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 14px;
    z-index: 1000;
    border: 2px solid #ccc;
    overflow: hidden;
`;

const pStyle = css`
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: ${theme.colors.descriptionText};
    margin: 6px 0;

    span {
        font-size: 16px;
        font-weight: 600;
        color: ${theme.colors.primary};
    }
`;

export default ResizingSpinner;
