import { css } from '@emotion/react';

import ButtonContainer from '@/components/common/button/ButtonContainer';
import theme from '@/styles/theme';

export interface RowButtonModalProps {
    descriptionText: string;
    confirmText: string;
    cancelText: string;
    confirmModal?: () => void;
    closeModal?: () => void;
}

const RowButtonModal = ({
    descriptionText,
    confirmText,
    cancelText,
    confirmModal,
    closeModal,
}: RowButtonModalProps): JSX.Element => (
    <div css={modalStyle}>
        <h2>{descriptionText}</h2>
        <ButtonContainer
            confirmText={confirmText}
            cancelText={cancelText}
            size='full'
            confirmModal={confirmModal}
            closeModal={closeModal}
        />
    </div>
);

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
    width: 340px;
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
