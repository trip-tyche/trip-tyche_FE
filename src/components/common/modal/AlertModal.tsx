import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import ModalOverlay from '@/components/common/modal/ModalOverlay';

interface AlertModalProps {
    buttonText: string;
    closeModal?: () => void;
    isOverlay?: boolean;
    children: React.ReactNode;
}

const AlertModal = ({ buttonText, closeModal, isOverlay = false, children }: AlertModalProps) => {
    const a = 1;
    return (
        <>
            {isOverlay && <ModalOverlay />}
            <div css={modalStyle}>
                <div css={contentStyle}>{children}</div>
                <div css={buttonContainer}>
                    <Button text={buttonText} btnTheme='pri' size='lg' onClick={closeModal} />
                </div>
            </div>
        </>
    );
};

const modalStyle = css`
    width: 100vw;
    max-width: 360px;
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
