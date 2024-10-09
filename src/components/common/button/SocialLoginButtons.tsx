import { css, SerializedStyles } from '@emotion/react';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';

import { SOCIAL_LOGIN } from '@/constants/auth';
import theme from '@/styles/theme';

interface SocialLoginButtonsProps {
    provider: 'kakao' | 'google';
    handleSocialLogin: () => void;
}

const SocialLoginButtons = ({ provider, handleSocialLogin }: SocialLoginButtonsProps): JSX.Element => (
    <button css={buttonStyle(provider)} onClick={handleSocialLogin}>
        {provider === 'kakao' ? (
            <>
                <RiKakaoTalkFill css={iconStyle} /> {SOCIAL_LOGIN.KAKAO}
            </>
        ) : (
            <>
                <FcGoogle css={iconStyle} /> {SOCIAL_LOGIN.GOOGLE}
            </>
        )}
    </button>
);

const buttonStyle = (provider: 'kakao' | 'google') => css`
    background-color: ${provider === 'kakao' ? '#fee500' : '#fdfdfd'};
    color: #333;
    border: 0;
    border-radius: 12px;
    font-size: ${theme.fontSizes.normal_14};
    line-height: 1.5rem;
    font-weight: 600;
    width: 80%;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease-in-out;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        background-color: ${provider === 'kakao' ? '#fdd835' : '#DCDCDC'};
    }

    &:active {
        background-color: ${provider === 'kakao' ? '#fdd835' : '#DCDCDC'};
        transform: scale(0.99);
    }
`;

const iconStyle: SerializedStyles = css`
    height: 20px;
    width: 20px;
    position: absolute;
    left: 1.5rem;
`;

export default SocialLoginButtons;
