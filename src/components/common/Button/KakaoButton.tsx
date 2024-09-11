import { css, SerializedStyles } from '@emotion/react';

interface KakaoButtonProps {
    text?: string;
    handleLogin: () => void;
}

const KakaoButton = ({ text, handleLogin }: KakaoButtonProps): JSX.Element => (
    <button css={KakaoButtonStyle} onClick={handleLogin}>
        <span css={KakoButtonIcon}>🗨️</span>
        {text || '카카오톡으로 시작하기'}
    </button>
);

export default KakaoButton;

const KakaoButtonStyle = css`
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
    transition: transform 0.1s ease;

    &:hover {
        background-color: #fdd835;
    }

    &:active {
        background-color: #fdd835;
        transform: scale(0.99);
    }
`;

const KakoButtonIcon: SerializedStyles = css`
    margin-right: 8px;
`;
