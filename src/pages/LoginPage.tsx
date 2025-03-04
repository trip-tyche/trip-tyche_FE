import { css } from '@emotion/react';

import LoginButton from '@/components/features/auth/LoginButton';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import { OAUTH_CONFIG } from '@/constants/api/oauth';
import { COLORS } from '@/constants/theme';
import useBrowserCheck from '@/hooks/useBrowserCheck';

const LoginPage = () => {
    const { isModalOpen, closeModal } = useBrowserCheck({ showOnce: true });

    const handleLoginButtonClick = (provider: keyof typeof OAUTH_CONFIG.PATH) => {
        window.location.href = OAUTH_CONFIG.PATH[provider];
    };

    return (
        <div css={container}>
            <div css={textContainer}>
                <p css={logo}>TRIPTYCHE</p>
                <h3 css={titleStyle}>
                    사진 찍을 때마다 <br /> 그려지는 <strong css={strong}>나만의 여행 지도</strong>
                </h3>
            </div>
            <div css={buttonGroup}>
                <LoginButton provider='kakao' onClick={() => handleLoginButtonClick('KAKAO')} />
                <LoginButton provider='google' onClick={() => handleLoginButtonClick('GOOGLE')} />
                <p css={pStyle}>비회원으로 둘러보기</p>
            </div>
            {/* <p css={companyNameStyle}>© 2024 Vagabond. All rights reserved.</p> */}

            {isModalOpen && (
                <ConfirmModal
                    title='브라우저 변경 안내'
                    description='현재 카카오톡 브라우저를 사용 중이에요. 원활한 서비스 사용을 위해 Safari, Chrome, 웨일 사용을 추천드려요'
                    confirmText='확인'
                    confirmModal={closeModal}
                />
            )}

            <div css={overlay} />
        </div>
    );
};

const container = css`
    width: 100%;
    height: 100dvh;
    padding: 44px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    gap: 72px;
    background-image: url('/src/assets/images/background-image-mobile-2.webp');
    background-size: cover;
`;

const overlay = css`
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    background-color: #00000050;
    z-index: 10;
`;

const textContainer = css`
    display: flex;
    gap: 24px;
    flex-direction: column;
    align-self: flex-start;
    color: ${COLORS.TEXT.WHITE};
    z-index: 20;
`;

const logo = css`
    font-weight: bold;
    letter-spacing: 0.2px;
`;

const titleStyle = css`
    font-size: 24px;
    margin-bottom: 22px;
    line-height: 1.4;
`;

const strong = css`
    font-weight: 700;
`;

const buttonGroup = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
    z-index: 20;
`;

const pStyle = css`
    margin: 30px 0 0 14px;
    color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
    font-size: 12px;
    text-align: start;
    text-decoration: underline;
`;

// const companyNameStyle = css`
//     position: absolute;
//     bottom: 16px;
//     text-align: center;
//     font-size: ${theme.FONT_SIZES.SM};
//     color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
//     z-index: 20;
// `;

export default LoginPage;
