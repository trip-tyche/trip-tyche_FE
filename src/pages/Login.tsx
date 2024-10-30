import { css } from '@emotion/react';

import imageLeft from '/public/ogami_1.png';

import imageRight from '@/assets/images/ogami_2.png';
import SocialLoginButtons from '@/components/common/button/SocialLoginButtons';
import Toast from '@/components/common/Toast';
import { ENV, OAUTH_URL } from '@/constants/auth';
import theme from '@/styles/theme';

const Login = (): JSX.Element => {
    const oauthLinks = {
        // kakao: `/${OAUTH_URL}/kakao`,
        kakao: `${ENV.BASE_URL}/${OAUTH_URL}/kakao`,
        // google: `/${OAUTH_URL}/google`,
        google: `${ENV.BASE_URL}/${OAUTH_URL}/google`,
    };

    const handleSocialLogin = (provider: keyof typeof oauthLinks) => () => {
        window.location.href = oauthLinks[provider];
    };

    return (
        <div css={containerStyle}>
            <main css={mainStyle}>
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
                <div css={buttonContainerStyle}>
                    <SocialLoginButtons provider='kakao' handleSocialLogin={handleSocialLogin('kakao')} />
                    <SocialLoginButtons provider='google' handleSocialLogin={handleSocialLogin('google')} />
                </div>
            </main>
            <Toast />
        </div>
    );
};

const containerStyle = css`
    width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const mainStyle = css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 84px;
`;

const contentStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
`;

const imageContainerStyle = css`
    width: 200px;
    overflow: hidden;
    margin: 12px 0;
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

const buttonContainerStyle = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

export default Login;
