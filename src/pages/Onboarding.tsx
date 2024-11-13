import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Navigate } from 'react-router-dom';

import imageLeft from '@/assets/images/character-1.png';
import imageRight from '@/assets/images/character-2.png';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';

const Onboarding = () => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRedirect(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (redirect) {
        return <Navigate to={PATH.AUTH.LOGIN} replace />;
    }

    return (
        <div css={containerStyle}>
            <div css={contentStyle}>
                <div css={imageContainerStyle}>
                    <img css={imageStyle} src={imageLeft} alt='image-left' />
                    <img css={imageStyle} src={imageRight} alt='image-right' />
                </div>
                <div>
                    <h1 css={titleStyle}>여행의 추억을 티켓으로</h1>
                    <p css={subtitleStyle}>추억 티켓을 만들어 여행을 기록하세요</p>
                </div>
            </div>
        </div>
    );
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding: 20px;
    background-color: rgb(0, 115, 187, 0.8);
`;

const contentStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 18px;
`;

const imageContainerStyle = css`
    width: 200px; // 컨테이너의 너비를 설정
    overflow: hidden;
    margin: 12px 0;
`;

const imageStyle = css`
    width: 70px;
    height: auto;
    border-radius: 12px;
    margin-right: 8px;
`;

const titleStyle = css`
    font-size: ${theme.fontSizes.xxxlarge_24};
    font-weight: bold;
    margin-bottom: 14px;
    color: ${theme.colors.white};
`;

const subtitleStyle = css`
    font-size: ${theme.fontSizes.large_16};
    font-weight: 600;
    color: ${theme.colors.black};
`;

export default Onboarding;
