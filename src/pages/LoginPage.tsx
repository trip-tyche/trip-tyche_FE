import { css } from '@emotion/react';

import character1 from '@/assets/images/character-1.png';
import character2 from '@/assets/images/character-2.png';
import character3 from '@/assets/images/character-3.png';
import character4 from '@/assets/images/character-4.png';
import character5 from '@/assets/images/character-5.png';
import character6 from '@/assets/images/character-6.png';
import BrowserNoticeModal from '@/components/BrowserNoticeModal';
import LoginButton from '@/components/features/auth/LoginButton';
import { OAUTH_PATH } from '@/constants/auth';
import useBrowserCheck from '@/hooks/useBrowserCheck';
import theme from '@/styles/theme';

const LoginPage = () => {
    const { showNotice, handleBrowserChange, closeNotice } = useBrowserCheck({ showOnce: false });

    const handleLoginButtonClick = (provider: keyof typeof OAUTH_PATH) => {
        window.location.href = OAUTH_PATH[provider];
    };

    return (
        <div css={containerStyle}>
            <main css={mainStyle}>
                <div css={contentStyle}>
                    <div>
                        <div css={imageContainerStyle}>
                            <img css={imageStyle} src={character1} alt='character-1' />
                            <img css={imageStyle} src={character2} alt='character-2' />
                            <img css={imageStyle} src={character3} alt='character-3' />
                        </div>
                        <div css={imageContainerStyle}>
                            <img css={imageStyle} src={character4} alt='character-4' />
                            <img css={imageStyle} src={character5} alt='character-5' />
                            <img css={imageStyle} src={character6} alt='character-6' />
                        </div>
                    </div>
                    <div>
                        <h1 css={titleStyle}>여행 티켓에 시간과 공간을 담다</h1>
                        <p css={subtitleStyle}>여러분만의 티켓을 만들어 여행을 기록하세요</p>
                    </div>
                </div>
                <div css={buttonGroup}>
                    <LoginButton provider='kakao' onClick={() => handleLoginButtonClick('KAKAO')} />
                    <LoginButton provider='google' onClick={() => handleLoginButtonClick('GOOGLE')} />
                </div>
                <BrowserNoticeModal show={showNotice} onClose={closeNotice} onChangeBrowser={handleBrowserChange} />
            </main>
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
    gap: 72px;
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
    width: 50px;
    height: auto;
    margin-right: 8px;
`;

const titleStyle = css`
    font-size: ${theme.fontSizes.xxxlarge_24};
    font-weight: bold;
    margin-bottom: 14px;
`;

const subtitleStyle = css`
    font-size: ${theme.fontSizes.large_16};
    color: ${theme.colors.descriptionText};
`;

const buttonGroup = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 18px;
`;

export default LoginPage;
