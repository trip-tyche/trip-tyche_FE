import { ComponentProps } from 'react';

import { css } from '@emotion/react';

import Loading from '@/components/common/Loading';

interface ButtonProps extends ComponentProps<'button'> {
    btnTheme: 'pri' | 'sec';
    size: 'lg' | 'sm';
    isLoading?: boolean;
    loadingMessage?: string;
    className?: string;
    onClick: () => void;
    children?: React.ReactNode;
    text: string;
}

const Button = ({
    btnTheme,
    size,
    isLoading = false,
    loadingMessage,
    disabled,
    children,
    text,
    onClick,
}: ButtonProps) => (
    <button css={buttonStyle(btnTheme, size)} onClick={onClick} disabled={disabled || isLoading}>
        {isLoading && loadingMessage ? (
            <span css={spinnerStyle}>
                <p>{loadingMessage}</p>
            </span>
        ) : isLoading ? (
            <span css={spinnerStyle}>
                <Loading type='button' />
            </span>
        ) : (
            <>
                {children}
                {text}
            </>
        )}
    </button>
);

const ButtonLeft = ({ children }: { children?: React.ReactNode }) => <div css={iconStyle}>{children}</div>;

Button.Left = ButtonLeft;

export default Button;

const buttonStyle = (btnTheme: 'pri' | 'sec', size: 'lg' | 'sm') => css`
    ${basicButtonStyle}
    color: ${btnTheme === 'pri' ? '#f2f4f9' : '#0073bb'};
    background-color: ${btnTheme === 'pri' ? '#0073bb' : '#f2f4f9'};
    font-size: ${size === 'lg' ? '14px' : '12px'};
    border-radius: ${size === 'lg' ? '16px' : '8px'};
    width: ${size === 'lg' ? '100%' : 'auto'};
    height: ${size === 'lg' ? '48px' : '34px'};
    padding: ${size === 'lg' ? '0' : '0 12px'};

    :hover {
        background-color: ${btnTheme === 'pri' ? '#005d96' : '#e5e8f0'};
    }
`;

const basicButtonStyle = css`
    border: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:active {
        transform: scale(0.97);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const iconStyle = css`
    margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const spinnerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    p {
        font-size: 14px;
    }
`;
