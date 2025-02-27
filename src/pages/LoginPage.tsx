import { css } from '@emotion/react';

import character1 from '@/assets/images/character-ogami-1.png';
import character2 from '@/assets/images/character-ogami-2.png';
import LoginButton from '@/components/features/auth/LoginButton';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import { OAUTH_CONFIG } from '@/constants/api/oauth';
import useBrowserCheck from '@/hooks/useBrowserCheck';
import theme from '@/styles/theme';

const LoginPage = () => {
    const { isModalOpen, closeModal } = useBrowserCheck({ showOnce: true });

    const handleLoginButtonClick = (provider: keyof typeof OAUTH_CONFIG.PATH) => {
        window.location.href = OAUTH_CONFIG.PATH[provider];
    };

    return (
        <div css={container}>
            <div css={contentStyle}>
                <div>
                    <div css={imageContainerStyle}>
                        <img css={imageStyle} src={character1} alt='여행 캐릭터 1' />
                        <img css={imageStyle} src={character2} alt='여행 캐릭터 2' />
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

const container = css`
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
    display: flex;
    gap: 6px;
    margin: 12px 0;
`;

const imageStyle = css`
    width: 50px;
    height: auto;
    margin-right: 8px;
`;

const titleStyle = css`
    color: ${theme.COLORS.TEXT.BLACK};
    font-size: ${theme.FONT_SIZES.XXXL};
    font-weight: bold;
    margin-bottom: 22px;
`;

const subtitleStyle = css`
    color: ${theme.COLORS.TEXT.DESCRIPTION};
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
    font-size: ${theme.FONT_SIZES.SM};
    color: #868e96;
`;

export default LoginPage;
