import { css } from '@emotion/react';

import ButtonContainer from '@/components/common/Button/ButtonContainer';

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
        <p>{descriptionText}</p>
        <div>
            <ButtonContainer
                confirmText={confirmText}
                cancelText={cancelText}
                size='sm'
                confirmModal={confirmModal}
                closeModal={closeModal}
            />
        </div>
    </div>
);

export default RowButtonModal;

const modalStyle = css`
    p {
        font-size: 18px;
    }

    div {
        margin: 0.5rem 0;
        display: flex;
        justify-content: center;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 300px;
    height: 165px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 20px;
    z-index: 10;
    border: 1px solid #ccc;
`;
