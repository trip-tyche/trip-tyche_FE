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
                {title && <p css={titleStyle}>{title}</p>}
                <p css={descriptionStyle}>{description}</p>
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
    align-items: center;
`;

const iconWrapper = () => css`
    margin-right: 12px;
    align-self: flex-start;
`;

const contentStyle = css`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const titleStyle = css`
    font-weight: 500;
`;

const descriptionStyle = css`
    font-size: 14px;
    color: #4b5563;
    line-height: 1.2;
`;

export default AlertBox;
