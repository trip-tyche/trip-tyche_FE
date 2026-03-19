import React, { useEffect } from 'react';

import { css, keyframes, SerializedStyles } from '@emotion/react';
import { createPortal } from 'react-dom';

import theme from '@/shared/styles/theme';

interface ModalProps {
    closeModal?: () => void;
    isConfirm?: boolean;
    children: React.ReactNode;
    customStyle?: SerializedStyles;
}

const Modal = ({ closeModal, isConfirm = false, children, customStyle }: ModalProps) => {
    useEffect(() => {
        if (!closeModal || isConfirm) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeModal, isConfirm]);

    return createPortal(
        <React.Fragment>
            <div css={overlayStyle} onClick={!isConfirm ? closeModal : undefined}></div>
            <div css={modalStyle(customStyle)}>{children}</div>
        </React.Fragment>,
        document.getElementById('portal-root') || document.body,
    );
};

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
`;

const overlayFadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const modalStyle = (customStyle?: SerializedStyles) => css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: min(360px, calc(100vw - 32px));
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 16px;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    z-index: 1000;
    animation: ${fadeIn} 200ms ease-out;
    ${customStyle}
`;

const overlayStyle = css`
    width: 100%;
    height: 100dvh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    cursor: pointer;
    animation: ${overlayFadeIn} 200ms ease-out;
`;

export default Modal;
