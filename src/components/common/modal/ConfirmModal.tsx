// 대소문자 구별 필요 파일
import React from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import theme from '@/styles/theme';

export interface ConfirmModalProps {
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    confirmModal?: () => void;
    closeModal?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title,
    description,
    confirmText,
    cancelText,
    confirmModal,
    closeModal,
}) => (
    <>
        <ModalOverlay closeModal={closeModal} />
        <div css={modalStyle}>
            <h1 css={titleStyle}>{title}</h1>
            <p css={descriptionStyle}>{description}</p>
            <div css={buttonContainer}>
                <Button text={cancelText} btnTheme='sec' size='lg' onClick={closeModal} />
                <Button text={confirmText} btnTheme='pri' size='lg' onClick={confirmModal} />
            </div>
        </div>
    </>
);

const modalStyle = css`
    width: 100vw;
    max-width: 360px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 16px;
    background-color: ${theme.colors.modalBg};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const titleStyle = css`
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #181818;
    margin-top: 24px;
    margin-bottom: 20px;
`;
const descriptionStyle = css`
    font-size: 14px;
    margin: 0 26px 33px 26px;
    text-align: center;
    color: #5e5e5e;
    line-height: 20px;
`;
const buttonContainer = css`
    width: 100%;
    display: flex;
    padding: 0 12px;
    margin-bottom: 12px;
    gap: 8px;
`;

export default ConfirmModal;
