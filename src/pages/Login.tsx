import { css } from '@emotion/react';

import KakaoButton from '@/components/common/Button/KakaoButton';
import LogoImages from '@/components/common/LogoImages';
import FightHeader from '@/components/layout/AirplaneHeader';
import theme from '@/styles/theme';

const Login = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const oauthUrl = 'oauth2/authorization';

    const KAKAO_OAUTH_LINK: string = `${apiBaseUrl}/${oauthUrl}/kakao`;
    const GOOGLE_OAUTH_LINK: string = `${apiBaseUrl}/${oauthUrl}/google`;

    const handleKaKaoLogin = () => {
        window.location.href = KAKAO_OAUTH_LINK;
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_OAUTH_LINK;
    };

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
                <KakaoButton handleLogin={handleKaKaoLogin} />
            </div>
            <div css={buttonContainerStyle}>
                <KakaoButton handleLogin={handleGoogleLogin} />
            </div>
        </div>
    );
};

const containerStyle = css`
    min-height: 100vh;
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
    margin-bottom: 1rem;
`;

export default Login;
