import { css } from '@emotion/react';

import Button from '@/shared/components/common/Button';
import Modal from '@/shared/components/common/Modal/Modal';

interface AlertModalProps {
    confirmText: string;
    cancelText?: string;
    disabled?: boolean;
    disabledText?: string;
    children: React.ReactNode;
    confirmModal?: () => void;
    closeModal?: () => void;
}

const AlertModal = ({
    confirmText,
    cancelText,
    disabled = false,
    disabledText,
    children,
    confirmModal,
    closeModal,
}: AlertModalProps) => (
    <Modal>
        <div css={contentContainer}>{children}</div>
        <div css={buttonGroup}>
            {cancelText && <Button text={cancelText} variant='white' onClick={closeModal} />}
            <Button text={!disabled ? confirmText : disabledText} onClick={confirmModal} disabled={disabled} />
        </div>
    </Modal>
);

const contentContainer = css`
    margin-top: 12px;
`;

const buttonGroup = css`
    display: flex;
    gap: 8px;
    width: 100%;
    padding: 0 12px;
    margin-bottom: 12px;
`;

export default AlertModal;
