import { css } from '@emotion/react';

import { COLORS } from '@/constants/theme';
import theme from '@/styles/theme';

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
    height: 44px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    color: ${theme.COLORS.TEXT.BLACK};
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-bottom: 1px solid rgb(233, 233, 233);
    cursor: pointer;
`;

const textStyle = css`
    margin-left: 10px;
`;

export default SettingButton;
