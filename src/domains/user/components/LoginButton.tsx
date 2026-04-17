import { css } from '@emotion/react';

import Button from '@/shared/components/common/Button';
import theme from '@/shared/styles/theme';

type ProviderType = 'kakao' | 'google';

interface LoginButtonProps {
    provider: ProviderType;
    onClick: () => void;
}

const LoginButton = ({ provider, onClick }: LoginButtonProps) => {
    const providerConfig = {
        google: {
            text: 'Google 계정으로 시작하기',
            icon: '/google-icon.svg',
        },
        kakao: {
            text: '카카오로 5초안에 시작하기',
            icon: '/kakao-icon.svg',
        },
    };

    return (
        <Button
            text={providerConfig[provider].text}
            css={loginButtonStyles(provider)}
            onClick={onClick}
            icon={<img src={providerConfig[provider].icon} css={iconStyle} alt={`${provider} 로그인`} />}
        />
    );
};

const loginButtonStyles = (provider: ProviderType) => css`
    color: #1d1d1f;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.374px;
    position: relative;
    border-radius: 8px;
    background-color: ${provider === 'kakao' ? '#fee500' : '#ffffff'};
    border: 1px solid ${provider === 'kakao' ? 'transparent' : 'rgba(0,0,0,0.12)'};
    @media (hover: hover) {
        &:hover {
            background-color: ${provider === 'kakao' ? '#fdd835' : '#f5f5f7'};
        }
    }
    &:active {
        opacity: 0.85;
    }
`;

const iconStyle = css`
    position: absolute;
    left: 20px;
    width: 18px;
    height: 18px;
    margin-right: 0px;
`;

export default LoginButton;
