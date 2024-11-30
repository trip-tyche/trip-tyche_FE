import { css } from '@emotion/react';

import character1 from '@/assets/images/character-1.png';
import character2 from '@/assets/images/character-2.png';
import character3 from '@/assets/images/character-3.png';
import character4 from '@/assets/images/character-4.png';
import character5 from '@/assets/images/character-5.png';
import character6 from '@/assets/images/character-6.png';
import LoginButton from '@/components/features/auth/LoginButton';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import { OAUTH_PATH } from '@/constants/auth';
import useBrowserCheck from '@/hooks/useBrowserCheck';
import theme from '@/styles/theme';

const LoginPage = () => {
    const { isModalOpen, closeModal } = useBrowserCheck({ showOnce: true });

    const handleLoginButtonClick = (provider: keyof typeof OAUTH_PATH) => {
        window.location.href = OAUTH_PATH[provider];
    };

    return (
        <div css={pageContainer}>
            <div css={contentStyle}>
                <div>
                    <div css={imageContainerStyle}>
                        <img css={imageStyle} src={character1} alt='여행 캐릭터 1' />
                        <img css={imageStyle} src={character2} alt='여행 캐릭터 2' />
                        <img css={imageStyle} src={character3} alt='여행 캐릭터 3' />
                    </div>
                    <div css={imageContainerStyle}>
                        <img css={imageStyle} src={character4} alt='여행 캐릭터 4' />
                        <img css={imageStyle} src={character5} alt='여행 캐릭터 5' />
                        <img css={imageStyle} src={character6} alt='여행 캐릭터 6' />
                    </div>
                </div>
                <div>
                    <h1 css={titleStyle}>사진으로 그려지는 여행 지도</h1>
                    <p css={subtitleStyle}>지도 위에 그려진 추억을 다시 걸어보세요</p>
                </div>
            </div>
            <div css={buttonGroup}>
                <LoginButton provider='kakao' onClick={() => handleLoginButtonClick('KAKAO')} />
                <LoginButton provider='google' onClick={() => handleLoginButtonClick('GOOGLE')} />
            </div>
            <p css={companyNameStyle}>© 2024 Vagabond. All rights reserved.</p>
            {isModalOpen && (
                <ConfirmModal
                    title='브라우저 변경 안내'
                    description='현재 카카오톡 브라우저를 사용 중이에요. 원활한 서비스 사용을 위해 Safari, Chrome, 웨일 사용을 추천드려요'
                    confirmText='확인'
                    confirmModal={closeModal}
                />
            )}
        </div>
    );
};

const pageContainer = css`
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
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
    color: ${theme.colors.black};
    font-size: ${theme.fontSizes.xxxlarge_24};
    font-weight: bold;
    margin-bottom: 22px;
`;

const subtitleStyle = css`
    color: ${theme.colors.descriptionText};
`;

const buttonGroup = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 18px;
`;

const companyNameStyle = css`
    position: absolute;
    bottom: 16px;
    text-align: center;
    font-size: ${theme.fontSizes.small_12};
    color: #868e96;
`;

export default LoginPage;
