import { css } from '@emotion/react';

import KakaoButton from '@/components/common/Button/oauthButton';
import LogoImages from '@/components/common/LogoImages';
import FightHeader from '@/components/layout/AirplaneHeader';
import theme from '@/styles/theme';

const Login = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const oauthUrl = 'oauth2/authorization';

    const oauthLinks = {
        kakao: `${apiBaseUrl}/${oauthUrl}/kakao`,
        google: `${apiBaseUrl}/${oauthUrl}/google`,
    };

    const handleLogin = (provider: keyof typeof oauthLinks) => () => {
        window.location.href = oauthLinks[provider];
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
                <KakaoButton provider='kakao' handleLogin={handleLogin('kakao')} />
                <KakaoButton provider='google' handleLogin={handleLogin('google')} />
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 14px;
    margin-bottom: 1rem;
`;

export default Login;
