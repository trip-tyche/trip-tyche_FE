import React from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import ModalOverlay from '@/components/common/modal/ModalOverlay';

export interface GuideModalProps {
    confirmText: string;
    cancelText: string;
    confirmModal?: () => void;
    closeModal?: () => void;
    isOverlay?: boolean;
    children: React.ReactNode;
}

const GuideModal: React.FC<GuideModalProps> = ({
    confirmText,
    cancelText,
    confirmModal,
    closeModal,
    isOverlay = false,
    children,
}) => (
    <>
        {isOverlay && <ModalOverlay />}
        <div css={modalStyle}>
            <div css={contentStyle}>{children}</div>
            <div css={buttonContainer}>
                <Button text={cancelText} btnTheme='sec' size='lg' onClick={closeModal} />
                <Button text={confirmText} btnTheme='pri' size='lg' onClick={confirmModal} />
            </div>
        </div>
    </>
);

const modalStyle = css`
    width: 80vw;
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

export default GuideModal;
