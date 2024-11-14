import { css } from '@emotion/react';

import Button from '@/components/common/Button';
import ModalOverlay from '@/components/common/modal/ModalOverlay';

interface AlertModalProps {
    buttonText: string;
    closeModal?: () => void;
    isOverlay?: boolean;
    isDisable?: boolean;
    progress?: number;
    children: React.ReactNode;
}

const AlertModal = ({
    buttonText,
    closeModal,
    isOverlay = false,
    isDisable = false,
    progress,
    children,
}: AlertModalProps) => (
    <>
        {isOverlay && <ModalOverlay />}
        <div css={modalStyle}>
            <div css={contentStyle}>{children}</div>
            <div css={buttonContainer}>
                <Button
                    text={isDisable ? `사진 등록 준비 중 ${progress}%` : buttonText}
                    btnTheme='pri'
                    size='lg'
                    onClick={closeModal}
                    disabled={isDisable}
                />
            </div>
        </div>
    </>
);

const modalStyle = css`
    width: 100vw;
    max-width: 320px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 16px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const contentStyle = css`
    margin-top: 12px;
`;

const buttonContainer = css`
    width: 100%;
    display: flex;
    padding: 0 12px;
    margin-bottom: 12px;
    gap: 8px;
`;

export default AlertModal;
