import React from 'react';
import { css } from '@emotion/react';

interface KakaoButtonProps {
    handleLogin: () => void;
    text?: string;
}

const KakaoButton = ({ handleLogin, text }: KakaoButtonProps): JSX.Element => {
    return (
        <button css={KakaoButtonStyle} onClick={handleLogin}>
            <span css={KakoButtonIcon}>🗨️</span>
            {text || '카카오 로그인'}
        </button>
    );
};

export default KakaoButton;

const KakaoButtonStyle = css`
    background-color: #fee500;
    color: #333;
    border: none;
    border-radius: 12px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 600;
    width: 345px;
    height: 45px;
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
