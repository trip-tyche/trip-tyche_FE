import React from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { createPortal } from 'react-dom';

import theme from '@/shared/styles/theme';

interface ModalProps {
    closeModal?: () => void;
    isConfirm?: boolean;
    children: React.ReactNode;
    customStyle?: SerializedStyles;
}

const Modal = ({ closeModal, isConfirm = false, children, customStyle }: ModalProps) => {
    return createPortal(
        <React.Fragment>
            <div css={overlayStyle} onClick={!isConfirm ? closeModal : undefined}></div>
            <div css={modalStyle(customStyle)}>{children}</div>
        </React.Fragment>,
        document.getElementById('portal-root') || document.body,
    );
};

const modalStyle = (customStyle?: SerializedStyles) => css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 360px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 16px;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    z-index: 1000;
    ${customStyle}
`;

const overlayStyle = css`
    width: 100%;
    height: 100dvh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(0, 0, 0, 0.7);
    z-index: 999;
    cursor: pointer;
`;

export default Modal;
