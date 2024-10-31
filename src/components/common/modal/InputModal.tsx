import { Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import theme from '@/styles/theme';

export interface InputModalProps {
    title: string;
    infoMessage: string;
    placeholder: string;
    submitModal: () => void;
    setInputValue: Dispatch<SetStateAction<string>>;
    inputValue: string;
}

const InputModal: React.FC<InputModalProps> = ({
    title,
    infoMessage,
    placeholder,
    submitModal,
    setInputValue,
    inputValue,
}) => (
    <>
        <ModalOverlay />
        <div css={modalStyle}>
            <div css={inputContainer}>
                <h1>{title}</h1>
                <input
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={14}
                    placeholder={placeholder}
                    css={inputStyle(inputValue)}
                />
                {(inputValue.length === 1 || inputValue.length > 10) && <p>{infoMessage}</p>}
            </div>
            <div css={buttonContainer}>
                <Button
                    text='완료'
                    btnTheme='pri'
                    size='lg'
                    onClick={submitModal}
                    disabled={inputValue.length < 2 || inputValue.length > 10}
                />
            </div>
        </div>
    </>
);

const modalStyle = css`
    width: 100vw;
    max-width: 280px;
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

    div {
        width: 100%;
    }

    h1 {
        font-size: ${theme.fontSizes.large_16};
        font-weight: 600;
        text-align: center;
        margin-bottom: 24px;
    }

    p {
        margin-top: 4px;
        margin-left: 4px;
        color: #ff0101;
        font-size: ${theme.fontSizes.small_12};
    }
`;

const inputContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 104px;

    h1 {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #181818;
        margin-top: 24px;
        margin-bottom: 20px;
    }
`;

const baseInputStyle = css`
    border-radius: 8px;
    padding: 12px;
    font-size: ${theme.fontSizes.large_16};
    width: 90%;
    height: 38px;
    outline: none;
    margin-bottom: 13;
`;

const inputStyle = (inputValue: string) => css`
    ${baseInputStyle};
    border: 1px solid ${inputValue.length === 1 || inputValue.length > 10 ? '#ff0101' : '#DDDDDD'};
`;

const buttonContainer = css`
    width: 100%;
    padding: 0 12px;
    margin: 24px 0 12px 0;
`;

export default InputModal;
