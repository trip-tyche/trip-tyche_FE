import { css } from '@emotion/react';

import upLoadingImage from '@/assets/images/loading.gif';
import Modal from '@/components/common/Modal';
import theme from '@/styles/theme';

const UploadingSpinner = () => {
    return (
        <Modal>
            <div css={uploadingContainer}>
                <img src={upLoadingImage} />
                <p css={textStyle}>{`새로운 $ ? '사진을 추가' : '여행을 등록'}하고 있습니다`}</p>
                {/* <p css={textStyle}>{`새로운 ${isTripInfoEditing ? '사진을 추가' : '여행을 등록'}하고 있습니다`}</p> */}
            </div>
        </Modal>
    );
};

const uploadingContainer = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    border-radius: 14px;
    border: 2px solid ${theme.COLORS.BACKGROUND.WHITE};
    overflow: hidden;
`;

const textStyle = css`
    font-weight: 600;
    text-align: center;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
    margin: 16px 0;
`;

export default UploadingSpinner;
