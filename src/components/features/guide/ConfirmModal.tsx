import { css } from '@emotion/react';

import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

export interface ConfirmModalProps {
    title: string;
    description?: string;
    confirmText: string;
    cancelText?: string;
    confirmModal?: () => void;
    closeModal?: () => void;
}

const ConfirmModal = ({ title, description, confirmText, cancelText, confirmModal, closeModal }: ConfirmModalProps) => (
    <Modal closeModal={closeModal} isConfirm>
        <h1 css={titleStyle}>{title}</h1>
        <p css={descriptionStyle}>{description}</p>
        <div css={buttonGroup}>
            {cancelText && <Button text={cancelText} variant='white' onClick={closeModal} />}
            <Button text={confirmText} onClick={confirmModal} />
        </div>
    </Modal>
);

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

const buttonGroup = css`
    width: 100%;
    display: flex;
    padding: 0 12px;
    margin-bottom: 12px;
    gap: 8px;
`;

export default ConfirmModal;
