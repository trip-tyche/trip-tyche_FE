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
            icon={<img src={providerConfig[provider].icon} css={iconStyle} />}
        />
    );
};

const loginButtonStyles = (provider: ProviderType) => css`
    color: ${theme.COLORS.TEXT.BLACK};
    font-size: 14px;
    letter-spacing: -0.5px;
    position: relative;
    background-color: ${provider === 'kakao' ? '#fee500' : '#fdfdfd'};
    @media (hover: hover) {
        &:hover {
            background-color: ${provider === 'kakao' ? '#fdd835' : '#DCDCDC'};
        }
    }
    &:active {
        background-color: ${provider === 'kakao' ? '#fdd835' : '#DCDCDC'};
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
