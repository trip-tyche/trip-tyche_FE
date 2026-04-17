import { css } from '@emotion/react';

interface SettingButtonProps {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

const SettingButton = ({ text, icon, onClick, disabled = false }: SettingButtonProps) => {
    return (
        <li css={[buttonStyle, disabled && disabledStyle]} onClick={disabled ? undefined : onClick}>
            {icon}
            <p css={textStyle}>{text}</p>
        </li>
    );
};

const buttonStyle = css`
    height: 52px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    color: #0f172a;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    @media (hover: hover) {
        &:hover {
            background-color: #f8fafc;
        }
    }
    &:active {
        background-color: #f8fafc;
    }
`;

const textStyle = css`
    margin-left: 12px;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: -0.374px;
`;

const disabledStyle = css`
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
`;

export default SettingButton;
