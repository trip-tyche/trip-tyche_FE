import { css } from '@emotion/react';

import upLoadingImage from '@/assets/images/loading.gif';
import Modal from '@/components/common/Modal';
import theme from '@/styles/theme';

const UploadingSpinner = () => (
    <Modal>
        <div css={uploadingContainer}>
            <img src={upLoadingImage} />
            <p css={textStyle}>새로운 여행이 등록 중입니다...</p>
        </div>
    </Modal>
);

const uploadingContainer = css`
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.white};
    border-radius: 14px;
    border: 2px solid ${theme.colors.white};
    overflow: hidden;
`;

const textStyle = css`
    font-weight: 600;
    text-align: center;
    color: ${theme.colors.descriptionText};
    margin: 16px 0;
`;

export default UploadingSpinner;
