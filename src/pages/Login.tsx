import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import KakaoButton from '@/components/common/Button/KakaoButton';
import LogoImages from '@/components/common/LogoImages';
import FightHeader from '@/components/layout/AirplaneHeader';
// import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';
import theme from '@/styles/theme';

const Login = () => {
    // const REDIRECT_URI = '/kakao/callback';
    // const LINK: string = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    // const LINK: string = `ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/oauth2/code/google`;

    const handleLogin = () => {
        // window.location.href = LINK;
        navigate('/oauth2/success');
    };

    const navigate = useNavigate();

    return (
        <div css={containerStyle}>
            <FightHeader />
            <div css={textStyle}>
                <h1>오감 저리는 여행 기록 플랫폼</h1>
                <p>오감 저리는 여행 기록 플랫폼입니다.</p>
                <p>오감 저리게 시작해보세요</p>
            </div>

            <div css={imageStyle}>
                <LogoImages />
            </div>

            <div css={buttonContainerStyle}>
                <KakaoButton handleLogin={handleLogin} />
            </div>
        </div>
    );
};

const containerStyle = css`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const textStyle = css`
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    h1 {
        color: ${theme.colors.black};
        font-size: ${theme.fontSizes.xxlarge_20};
        font-weight: 600;
        margin: 3rem 0 1.5rem;
    }
    p {
        color: ${theme.colors.disabledText};
        font-size: ${theme.fontSizes.normal_14};
    }
`;

const imageStyle = css`
    flex: 3;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const buttonContainerStyle = css`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
`;

export default Login;
