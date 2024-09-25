import { css } from '@emotion/react';

import SocialLoginButtons from '@/components/common/button/SocialLoginButtons';
import LogoImages from '@/components/common/LogoImages';
import FightHeader from '@/components/layout/AirplaneHeader';
import { ENV, OAUTH_URL } from '@/constants/auth';
import theme from '@/styles/theme';

const Login = (): JSX.Element => {
    const oauthLinks = {
        kakao: `${ENV.BASE_URL}/${OAUTH_URL}/kakao`,
        google: `${ENV.BASE_URL}/${OAUTH_URL}/google`,
    };

    const handleSocialLogin = (provider: keyof typeof oauthLinks) => () => {
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

            <div css={imageWrapperStyle}>
                <LogoImages />
            </div>

            <div css={buttonContainerStyle}>
                <SocialLoginButtons provider='kakao' handleSocialLogin={handleSocialLogin('kakao')} />
                <SocialLoginButtons provider='google' handleSocialLogin={handleSocialLogin('google')} />
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

const imageWrapperStyle = css`
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
