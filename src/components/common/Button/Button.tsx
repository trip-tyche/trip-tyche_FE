import { css } from '@emotion/react';

import Loading from '@/components/common/Loading';

export interface ButtonProps {
    text: string;
    theme: 'pri' | 'sec';
    size: 'full' | 'lg' | 'sm';
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

const Button = ({
    text,
    theme,
    size,
    onClick,
    disabled,
    isLoading = false,
    children,
}: ButtonProps & { children?: React.ReactNode }): JSX.Element => (
    <button css={buttonStyle(theme, size)} onClick={onClick} disabled={disabled || isLoading}>
        {isLoading ? (
            <span css={spinnerStyle}>
                <Loading type='button' />
            </span>
        ) : (
            <>
                {text}
                {children}
            </>
        )}
    </button>
);

const ButtonLeft = ({ children }: { children?: React.ReactNode }) => (
    <span style={{ marginRight: '8px' }}>{children}</span>
);

Button.Left = ButtonLeft;

export default Button;

const buttonStyle = (theme: 'pri' | 'sec', size: 'full' | 'lg' | 'sm') => css`
    padding: 8px 12px;
    border-radius: 10px;
    border: ${theme === 'pri' ? '1px solid #333' : '0'};
    font-size: ${size === 'full' ? '14px' : '12px'};
    font-weight: 600;
    cursor: pointer;
    width: ${size === 'lg' ? '220px' : size === 'sm' ? '80px' : '100%'};
    height: ${size === 'full' ? '44px' : '32px'};
    line-height: 16px;
    transition: all 0.2s ease;

    color: ${theme === 'pri' ? '#333' : '#fff'};
    background-color: ${theme === 'pri' ? '#fff' : '#333'};

    &:active {
        transform: scale(0.97);
        /* background-color: rgb(51, 51, 51, 0.85); */
    }

    &:hover {
        /* background-color: rgb(51, 51, 51, 0.85); */
    }

    &:disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }
`;

const spinnerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
