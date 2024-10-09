import { useEffect, useState } from 'react';

import { css, keyframes } from '@emotion/react';
import { Navigate } from 'react-router-dom';

import imageLeft from '@/assets/images/ogami_1.png';
import imageRight from '@/assets/images/ogami_2.png';
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
        return <Navigate to={PATH.LOGIN} replace />;
    }

    return (
        <div css={containerStyle}>
            <div css={contentStyle}>
                <div css={imageContainerStyle}>
                    <div css={imageSlideStyle}>
                        <img css={imageStyle} src={imageLeft} alt='image-left' />
                        <img css={imageStyle} src={imageRight} alt='image-right' />
                        <img css={imageStyle} src={imageLeft} alt='image-left' />
                        <img css={imageStyle} src={imageRight} alt='image-right' />
                        <img css={imageStyle} src={imageLeft} alt='image-left' />
                        <img css={imageStyle} src={imageRight} alt='image-right' />
                    </div>
                </div>
                <div>
                    <h1 css={titleStyle}>여행을 통해 추억을 남기다</h1>
                    <p css={subtitleStyle}>당신만의 특별한 여정을 기록하세요</p>
                </div>
            </div>
        </div>
    );
};

const slideAnimation = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
`;

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 20px;
`;

const contentStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
`;

const imageContainerStyle = css`
    width: 200px; // 컨테이너의 너비를 설정
    overflow: hidden;
    margin: 12px 0;
`;

const imageSlideStyle = css`
    display: flex;
    animation: ${slideAnimation} 1.5s linear infinite;
`;

const imageStyle = css`
    width: 60px;
    height: auto;
    border-radius: 12px;
    margin-right: 8px;
`;

const titleStyle = css`
    font-size: ${theme.fontSizes.xxxlarge_24};
    font-weight: bold;
    margin-bottom: 10px;
`;

const subtitleStyle = css`
    font-size: ${theme.fontSizes.large_16};
    color: ${theme.colors.descriptionText};
`;

export default Onboarding;
