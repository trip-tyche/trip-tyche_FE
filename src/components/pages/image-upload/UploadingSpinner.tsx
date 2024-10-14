import { css } from '@emotion/react';

import loadingImage from '@/assets/images/flightLoading5.gif';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import theme from '@/styles/theme';

const UPLOADING_MESSAGE = `새로운 추억의 조각들을 저장 중입니다..`;

const UploadingSpinner = ({ imageCount }: { imageCount: number }) => (
    <>
        <ModalOverlay />
        <div css={divStyle}>
            <img src={loadingImage} />
            <p css={pStyle}>
                {<span>{imageCount}</span>} 개의 {UPLOADING_MESSAGE}
            </p>
        </div>
    </>
);

const divStyle = css`
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
    margin: 8px 0;

    span {
        font-size: 16px;
        font-weight: 600;
        color: ${theme.colors.primary};
    }
`;

export default UploadingSpinner;
