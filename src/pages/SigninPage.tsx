import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Tooltip } from '@mantine/core';

import backgroundImage from '@/assets/images/background-mobile-3.webp';
import LoginButton from '@/domains/user/components/LoginButton';
import { OAUTH_CONFIG } from '@/libs/apis/shared/constants';
import { COLORS } from '@/shared/constants/style';

const SigninPage = () => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    useEffect(() => {
        if (isTooltipOpen) {
            setTimeout(() => {
                setIsTooltipOpen(false);
            }, 2000);
        }
    }, [isTooltipOpen]);

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
                <Tooltip
                    label='준비 중인 기능입니다.'
                    color={COLORS.PRIMARY}
                    opened={isTooltipOpen}
                    position='top-start'
                    offset={{ mainAxis: 12 }}
                    withArrow
                    arrowOffset={44}
                    arrowSize={6}
                    transitionProps={{ duration: 300, transition: 'pop' }}
                >
                    <p css={pStyle} onClick={() => setIsTooltipOpen(true)}>
                        비회원으로 둘러보기
                    </p>
                </Tooltip>
            </div>

            <div css={overlay} />
        </div>
    );
};

const container = css`
    width: 100%;
    height: 100dvh;
    padding: 44px 24px 60px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    gap: 72px;
    background-image: url(${backgroundImage});
    background-size: cover;
    user-select: none;
`;

const overlay = css`
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    background-color: #00000010;
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
    width: max-content;
    margin: 24px 0 0 14px;
    color: #dddddd;
    font-size: 12px;
    text-align: start;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.5s;

    :hover {
        color: ${COLORS.TEXT.WHITE};
    }
`;

// const companyNameStyle = css`
//     position: absolute;
//     bottom: 16px;
//     text-align: center;
//     font-size: ${theme.FONT_SIZES.SM};
//     color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
//     z-index: 20;
// `;

export default SigninPage;
