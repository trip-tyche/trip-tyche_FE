import { css } from '@emotion/react';

import Button from '@/shared/components/common/Button';
import Input from '@/shared/components/common/Input';
import Modal from '@/shared/components/common/Modal/Modal';
import theme from '@/shared/styles/theme';

export interface InputModalProps {
    error?: string;
    value: string;
    onChange: (value: string) => void;
    title: string;
    description?: string;
    confirmText: string;
    cancelText?: string;
    confirmModal?: () => void;
    closeModal?: () => void;
    disabled: boolean;
    placeholder?: string;
}

const InputModal = ({
    error,
    value,
    onChange,
    title,
    description,
    confirmText,
    cancelText,
    confirmModal,
    closeModal,
    disabled,
    placeholder,
}: InputModalProps) => {
    return (
        <Modal closeModal={closeModal}>
            <h1 css={titleStyle}>{title}</h1>
            <p css={descriptionStyle}>{description}</p>

            <div css={inputWrapper}>
                <Input value={value} onChange={onChange} placeholder={placeholder} />
                {error && <p css={errorMessage}>{error}</p>}
            </div>
            <div css={buttonGroup}>
                {cancelText && <Button text={cancelText} variant='white' onClick={closeModal} />}
                <Button text={confirmText} onClick={confirmModal} disabled={disabled} />
            </div>
        </Modal>
    );
};

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
    margin: 0 26px 20px 26px;
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

const inputWrapper = css`
    position: relative;
    width: 90%;
    margin-bottom: 20px;
`;

const errorMessage = css`
    margin-top: 8px;
    margin-left: 4px;
    text-align: center;
    color: ${theme.COLORS.TEXT.ERROR};
    font-size: ${theme.FONT_SIZES.MD};
`;

export default InputModal;
