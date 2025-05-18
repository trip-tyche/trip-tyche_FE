import { css } from '@emotion/react';

import { THEME_COLORS } from '@/shared/constants/style';
import { ThemeType } from '@/shared/types';

interface AlertBoxProps {
    theme?: ThemeType;
    title?: string;
    description: string;
    icon: React.ReactNode;
}

const AlertBox = ({ theme = 'default', title, description, icon }: AlertBoxProps) => {
    return (
        <div css={container(theme)}>
            <div css={iconWrapper}>{icon}</div>

            <div css={contentStyle}>
                {title && <p css={titleStyle(theme)}>{title}</p>}
                <p css={descriptionStyle(theme)}>{description}</p>
            </div>
        </div>
    );
};

const container = (theme: ThemeType) => css`
    color: ${THEME_COLORS[theme].TEXT};
    background-color: ${THEME_COLORS[theme].BACKGROUND};
    border-radius: 8px;
    padding: 16px;
    display: flex;
`;

const iconWrapper = () => css`
    margin-right: 12px;
`;

const contentStyle = css`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const titleStyle = (theme: ThemeType) => css`
    font-size: ${(theme === 'warning' || theme === 'error') && '14px'};
    font-weight: 600;
`;

const descriptionStyle = (theme: ThemeType) => css`
    font-size: 14px;
    color: ${theme === 'warning' || theme === 'error' ? THEME_COLORS[theme].TEXT : '#4b5563'};
    line-height: 1.3;
`;

export default AlertBox;
