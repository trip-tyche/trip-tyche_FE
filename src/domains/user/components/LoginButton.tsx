import { css } from '@emotion/react';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';

import Button from '@/shared/components/common/Button';
import { BUTTON } from '@/shared/constants/ui';
import theme from '@/shared/styles/theme';

type ProviderType = 'kakao' | 'google';

interface LoginButtonProps {
    provider: ProviderType;
    onClick: () => void;
}

const LoginButton = ({ provider, onClick }: LoginButtonProps) => (
    <Button
        text={provider === 'kakao' ? BUTTON.OAUTH.KAKAO : BUTTON.OAUTH.GOOGLE}
        css={loginButtonStyles(provider)}
        onClick={onClick}
        icon={provider === 'kakao' ? <RiKakaoTalkFill css={iconStyle} /> : <FcGoogle css={iconStyle} />}
    />
);

const loginButtonStyles = (provider: ProviderType) => css`
    color: ${theme.COLORS.TEXT.BLACK};
    /* border-radius: 12px; */
    /* line-height: 1.5rem; */
    font-size: 14px;
    /* font-weight: 500; */
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
