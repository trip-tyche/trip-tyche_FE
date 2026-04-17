import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import backgroundImage from '@/assets/images/background-mobile.webp';
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
                {/* <Tooltip
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
                </Tooltip> */}
            </div>

            <div css={overlay} />
        </div>
    );
};

const container = css`
    width: 100%;
    height: 100dvh;
    padding: 52px 24px 56px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    user-select: none;
`;

const overlay = css`
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.08) 40%,
        rgba(0, 0, 0, 0.55) 100%
    );
    z-index: 10;
`;

const textContainer = css`
    display: flex;
    gap: 16px;
    flex-direction: column;
    align-self: flex-start;
    color: #ffffff;
    z-index: 20;
`;

const logo = css`
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
`;

const titleStyle = css`
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 0.196px;
    line-height: 1.14;
    color: #ffffff;
`;

const strong = css`
    font-weight: 700;
    color: #ffffff;
`;

const buttonGroup = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 20;
`;

// const pStyle = css`
//     width: max-content;
//     margin: 24px 0 0 14px;
//     color: #dddddd;
//     font-size: 12px;
//     text-align: start;
//     text-decoration: underline;
//     cursor: pointer;
//     transition: color 0.5s;

//     :hover {
//         color: ${COLORS.TEXT.WHITE};
//     }
// `;

export default SigninPage;
