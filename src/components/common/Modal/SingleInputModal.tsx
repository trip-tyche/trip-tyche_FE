import { Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import theme from '@/styles/theme';

export interface SingleInputModalProps {
    title: string;
    infoMessage: string;
    placeholder: string;
    submitModal: () => void;
    setInputValue: Dispatch<SetStateAction<string>>;
    inputValue: string;
}

const SingleInputModal = ({
    title,
    infoMessage,
    placeholder,
    submitModal,
    setInputValue,
    inputValue,
}: SingleInputModalProps): JSX.Element => {
    const a = 1;
    console.log(inputValue.length);
    return (
        <div css={modalStyle}>
            <h2>{title}</h2>
            <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={14}
                placeholder={placeholder}
                css={inputStyle(inputValue)}
            />
            {(inputValue.length === 1 || inputValue.length > 10) && <p className='infoMessage'>{infoMessage}</p>}
            <div className='buttonWrapper'>
                <Button
                    text='완료'
                    theme='sec'
                    size='sm'
                    onClick={submitModal}
                    disabled={inputValue.length < 2 || inputValue.length > 10}
                />
            </div>
        </div>
    );
};

const modalStyle = css`
    h2 {
        font-size: ${theme.fontSizes.large_16};
        font-weight: 600;
        text-align: center;
        margin-bottom: 14px;
    }

    .infoMessage {
        margin-top: 8px;
        margin-left: 4px;
        color: #ff0101;
        font-size: ${theme.fontSizes.small_12};
    }

    .buttonWrapper {
        margin-top: 14px;
        align-self: flex-end;
        display: flex;
        align-items: end;
        flex: 1;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 280px;
    height: 180px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: stretch;
    border-radius: 20px;
    z-index: 1000;
    border: 1px solid #ccc;
`;

const baseInputStyle = css`
    border-radius: 4px;
    padding: 12px;
    font-size: ${theme.fontSizes.normal_14};
    width: 100%;
    height: 38px;
    outline: none;
`;

const inputStyle = (inputValue: string) => css`
    ${baseInputStyle};
    border: 1px solid ${inputValue.length === 1 || inputValue.length > 10 ? '#ff0101' : '#ccc'};
`;

export default SingleInputModal;
