import { css } from '@emotion/react';

export interface ButtonProps {
    text: string;
    theme: 'pri' | 'sec';
    size: 'lg' | 'sm';
    onClick?: () => void;
    disabled?: boolean;
}

// 부모 Button 컴포넌트
const Button = ({
    text,
    theme,
    size,
    onClick,
    disabled,
    children,
}: ButtonProps & { children?: React.ReactNode }): JSX.Element => (
    <button css={ButtonStyle(theme, size)} onClick={onClick} disabled={disabled}>
        {text}
        {children} {/* 자식 컴포넌트를 여기에 렌더링 */}
    </button>
);

// 자식 컴포넌트 정의
Button.Left = ({ children }: { children?: React.ReactNode }) => (
    <span style={{ marginRight: '8px' }}>{children}</span> // Left 스타일
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
