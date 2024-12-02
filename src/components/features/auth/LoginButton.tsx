import { css } from '@emotion/react';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';

import Button from '@/components/common/Button';
import { OAUTH_CONFIG } from '@/constants/api/oauth';
import theme from '@/styles/theme';

type ProviderType = 'kakao' | 'google';

interface LoginButtonProps {
    provider: ProviderType;
    onClick: () => void;
}

const LoginButton = ({ provider, onClick }: LoginButtonProps) => (
    <Button
        text={provider === 'kakao' ? OAUTH_CONFIG.LABELS.KAKAO : OAUTH_CONFIG.LABELS.GOOGLE}
        css={loginButtonStyles(provider)}
        onClick={onClick}
        icon={provider === 'kakao' ? <RiKakaoTalkFill css={iconStyle} /> : <FcGoogle css={iconStyle} />}
    />
);

const loginButtonStyles = (provider: ProviderType) => css`
    color: ${theme.COLORS.TEXT.BLACK};
    border-radius: 12px;
    line-height: 1.5rem;
    font-weight: 600;
    width: 80%;
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
    left: 1.5rem;
    width: 20px;
    height: 20px;
    margin-right: 0px;
`;

export default LoginButton;
