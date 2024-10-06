import { css } from '@emotion/react';

import mapImage from '@/assets/images/map-image.png';
import ButtonContainer from '@/components/common/button/ButtonContainer';
import theme from '@/styles/theme';

export interface RowButtonModalProps {
    descriptionText?: string;
    confirmText: string;
    cancelText: string;
    confirmModal?: () => void;
    closeModal?: () => void;
    noDateImagesCount?: number;
    imagesNoLocationCount?: number;
}

const RowButtonModal = ({
    descriptionText,
    confirmText,
    cancelText,
    confirmModal,
    closeModal,
    noDateImagesCount,
    imagesNoLocationCount,
}: RowButtonModalProps): JSX.Element => {
    let noDataImagesCount = 0;
    if (noDateImagesCount === undefined || imagesNoLocationCount === undefined) {
        noDataImagesCount = 0;
    } else noDataImagesCount = noDateImagesCount + imagesNoLocationCount;

    return (
        <div css={modalStyle}>
            {descriptionText && <h2>{descriptionText}</h2>}
            {noDataImagesCount && (
                <div css={noDataContainer}>
                    <h3 css={noDataTextStyle}>
                        <span css={countStyle}>{noDataImagesCount}</span>개의 사진이 위치 또는 날짜 정보가 없습니다 😢
                    </h3>
                    <img css={mapImageStyle} src={mapImage} alt='map-image' />
                    <p>위치 정보가 없는 사진의 경우, 직접 위치를 설정할 수 있습니다.</p>
                </div>
            )}
            <ButtonContainer
                confirmText={confirmText}
                cancelText={cancelText}
                size='full'
                confirmModal={confirmModal}
                closeModal={closeModal}
            />
        </div>
    );
};
const noDataContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    p {
        font-size: 12px;
        color: #666;
        font-weight: 600;
    }
`;
const noDataTextStyle = css`
    font-size: 16px;
    font-weight: 600;
    color: #666;
`;

const countStyle = css`
    font-size: 18px;
    font-weight: 600;
    margin: 0 4px;
    color: #0073bb;
`;

const mapImageStyle = css`
    width: 95%;
    opacity: 0.9;
    border: 2px solid #ddd;
    border-radius: 20px;
`;

const modalStyle = css`
    h2 {
        font-size: ${theme.fontSizes.xxlarge_20};
        font-weight: 600;
    }

    div {
        margin-top: 8px;
        display: flex;
        justify-content: center;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 360px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    border-radius: 14px;
    z-index: 1000;
    border: 1px solid #ccc;
`;

export default RowButtonModal;
