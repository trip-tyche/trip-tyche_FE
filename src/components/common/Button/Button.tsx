import { css } from '@emotion/react';

export interface ButtonProps {
    text: string;
    theme: 'pri' | 'sec';
    size: 'lg' | 'sm';
    onClick?: () => void;
    disabled?: boolean;
}

const Button = ({ text, theme, size, onClick, disabled }: ButtonProps): JSX.Element => (
    <button css={ButtonStyle(theme, size)} onClick={onClick} disabled={disabled}>
        {text}
    </button>
);

export default Button;

const ButtonStyle = (theme: 'pri' | 'sec', size: 'lg' | 'sm') => css`
    padding: 8px 12px;
    border-radius: 10px;
    border: 2px solid #333;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    width: ${size === 'lg' ? '220px' : '80px'};
    height: 34px;
    line-height: 16px;
    transition: background-color 0.3s ease;

    color: ${theme === 'pri' ? '#333' : '#fff'};
    background-color: ${theme === 'pri' ? '#fff' : '#333'};

    &:active {
        transform: scale(0.99);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
