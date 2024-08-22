import { css } from '@emotion/react';

interface KakaoButtonProps {
    handleLogin: () => void;
    text?: string;
}

const KakaoButton = ({ handleLogin, text }: KakaoButtonProps): JSX.Element => {
    return (
        <button css={KakaoButtonStyle} onClick={handleLogin}>
            <span css={KakoButtonIcon}>🗨️</span>
            <rect x='0.25' y='0.5' width='17.5' height='16.25' fill='url(#pattern0_5_10390)'></rect>
            {text || '카카오톡으로 시작하기'}
        </button>
    );
};

export default KakaoButton;

const KakaoButtonStyle = css`
    /* background-color: rgb(254, 229, 0); */
    background-color: rgb(255 227 78);
    color: #333;
    border: none;
    border-radius: 12px;
    /* padding: 8px 16px; */
    padding: 0.875rem;
    font-size: 16px;
    line-height: 1.5rem;
    font-weight: 600;
    /* width: 100%; */
    width: 345px;
    height: 52px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #fdd835;
    }

    &:active {
        background-color: #fdd835;
        /* background-color: #f9a825; */
        /* 모바일의 경우, hover가 적용되지 않으므로 active로 */
    }
`;

const KakoButtonIcon = css`
    margin-right: 8px;
`;
