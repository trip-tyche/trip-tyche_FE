import { css } from '@emotion/react';

import ButtonContainer from '@/components/common/button/ButtonContainer';
import theme from '@/styles/theme';

export interface ColumnButtonModalProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmModal?: () => void;
    closeModal?: () => void;
}

const ColumnButtonModal = ({
    title,
    message,
    confirmText,
    cancelText,
    confirmModal,
    closeModal,
}: ColumnButtonModalProps): JSX.Element => (
    <div css={modalStyle}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div>
            <ButtonContainer
                confirmText={confirmText}
                cancelText={cancelText}
                size='lg'
                confirmModal={confirmModal}
                closeModal={closeModal}
            />
        </div>
    </div>
);

export default ColumnButtonModal;

const modalStyle = css`
    h2 {
        font-size: ${theme.fontSizes.xxlarge_20};
        font-weight: 600;
    }
    p {
        font-size: ${theme.fontSizes.normal_14};
        color: ${theme.colors.tertiaryHover};
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
    width: 260px;
    height: auto;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 16px;
    z-index: 1000;
    border: 1px solid #ccc;
`;
