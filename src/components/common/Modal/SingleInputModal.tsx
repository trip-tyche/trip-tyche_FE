import { Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/Button/Button';
import theme from '@/styles/theme';

export interface SingleInputModalProps {
    title: string;
    infoMessage: string;
    exampleText: string;
    submitModal: () => void;
    setInputValue: Dispatch<SetStateAction<string>>;
    value: string;
}

const SingleInputModal = ({
    title,
    infoMessage,
    exampleText,
    submitModal,
    setInputValue,
    value,
}: SingleInputModalProps): JSX.Element => (
    <div css={modalStyle}>
        <h2>{title}</h2>
        <input type='text' value={value} onChange={(e) => setInputValue(e.target.value)} />
        <div className='description'>
            <p>{infoMessage}</p>
            <p>{exampleText}</p>
        </div>
        <div className='buttonWrapper'>
            <Button text='완료' theme='sec' size='sm' onClick={submitModal} />
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
        flex: 1;
        display: flex;
        justify-content: end;
        align-items: end;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    width: 320px;
    height: 240px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    z-index: 10;
    border: 1px solid #ccc;
`;

export default SingleInputModal;
