import { Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import theme from '@/styles/theme';

export interface SingleInputModalProps {
    title: string;
    infoMessage: string;
    exampleText: string;
    submitModal: () => void;
    setInputValue: Dispatch<SetStateAction<string>>;
    inputValue: string;
}

const SingleInputModal = ({
    title,
    infoMessage,
    exampleText,
    submitModal,
    setInputValue,
    inputValue,
}: SingleInputModalProps): JSX.Element => (
    <div css={modalStyle}>
        <h2>{title}</h2>
        <input type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)} maxLength={10} />
        <div className='description'>
            <p>{infoMessage}</p>
            <p>{exampleText}</p>
        </div>
        <div className='buttonWrapper'>
            <Button text='완료' theme='sec' size='sm' onClick={submitModal} disabled={inputValue.length === 0} />
        </div>
    </div>
);

const modalStyle = css`
    h2 {
        font-size: ${theme.fontSizes.xxlarge_20};
        font-weight: 600;
        text-align: center;
        margin-bottom: 24px;
    }

    input {
        border-radius: 10px;
        border: 1px solid #ccc;
        padding: 1rem;
        font-size: ${theme.fontSizes.large_16};
        height: 44px;
    }

    .description {
        margin-top: 14px;
        margin-left: 4px;
        color: #9fa1ab;
        display: flex;
        flex-direction: column;
        font-size: ${theme.fontSizes.small_12};
    }

    .buttonWrapper {
        display: flex;
        justify-content: end;
        margin-top: 14px;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 280px;
    height: auto;
    padding: 18px;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    z-index: 1000;
    border: 1px solid #ccc;
`;

export default SingleInputModal;
