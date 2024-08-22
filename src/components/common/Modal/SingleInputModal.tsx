import { Dispatch, SetStateAction } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/common/Button/Button';

export interface SingleInputModalProps {
    titleText: string;
    descriptionText: string;
    exampleText: string;
    submitModal: () => void;
    setInputValue: Dispatch<SetStateAction<string>>;
    value: string;
}

const SingleInputModal = ({
    titleText,
    descriptionText,
    exampleText,
    submitModal,
    setInputValue,
    value,
}: SingleInputModalProps): JSX.Element => {
    return (
        <div css={modalStyle}>
            <h2>{titleText}</h2>
            <input type='text' value={value} onChange={(e) => setInputValue(e.target.value)} />
            <div className='description'>
                <p>{descriptionText}</p>
                <p>{exampleText}</p>
            </div>
            <div className='buttonWrapper'>
                <Button text='완료' theme='sec' size='sm' onClick={submitModal} />
            </div>
        </div>
    );
};

export default SingleInputModal;

const modalStyle = css`
    h2 {
        font-size: 22px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 24px;
    }

    input {
        border-radius: 10px;
        border: 1px solid #ccc;
        padding: 1rem;
        font-size: 18px;
        width: 280px;
        height: 44px;
    }

    .description {
        margin-top: 10px;
        margin-left: 4px;
        color: #9fa1ab;
        display: flex;
        flex-direction: column;
        font-size: 12px;
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
    width: 330px;
    height: 240px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    z-index: 10;
    border: 1px solid #ccc;
`;
