import { css } from '@emotion/react';

interface SettingButtonProps {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

const SettingButton = ({ text, icon, onClick }: SettingButtonProps) => {
    return (
        <li css={buttonStyle} onClick={onClick}>
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
    color: #1d1d1f;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    @media (hover: hover) {
        &:hover {
            background-color: #f5f5f7;
        }
    }
    &:active {
        background-color: #f5f5f7;
    }
`;

const textStyle = css`
    margin-left: 12px;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: -0.374px;
`;

export default SettingButton;
