import { css } from '@emotion/react';

import theme from '@/styles/theme';

interface SettingButtonProps {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

const SettingButton = ({ text, icon, onClick }: SettingButtonProps) => {
    return (
        <button css={buttonStyle} onClick={onClick}>
            {icon}
            <p css={textStyle}>{text}</p>
        </button>
    );
};

const buttonStyle = css`
    display: flex;
    align-items: center;
    border: none;
    background-color: transparent;
    padding: 15px 4px;
    cursor: pointer;
    color: ${theme.COLORS.TEXT.BLACK};
`;

const textStyle = css`
    margin-left: 10px;
`;

export default SettingButton;
