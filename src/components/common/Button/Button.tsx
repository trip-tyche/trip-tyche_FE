import { css } from '@emotion/react';

export interface ButtonProps {
    text: string;
    theme: 'pri' | 'sec';
    size: 'lg' | 'sm';
    onClick?: () => void;
}

const Button = ({ text, theme, size, onClick }: ButtonProps): JSX.Element => (
    <button css={ButtonStyle(theme, size)} onClick={onClick}>
        {text}
    </button>
);

export default Button;

const ButtonStyle = (theme: 'pri' | 'sec', size: 'lg' | 'sm') => css`
    padding: 8px 16px;
    border-radius: 10px;
    border: 2px solid #333;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: ${size === 'lg' ? '240px' : '120px'};
    height: 40px;
    transition: background-color 0.3s ease;

    color: ${theme === 'pri' ? '#333' : '#fff'};
    background-color: ${theme === 'pri' ? '#fff' : '#333'};

    &:active {
        transform: scale(0.99);
    }
`;
