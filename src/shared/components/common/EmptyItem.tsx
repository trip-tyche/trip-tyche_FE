import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/style';

interface EmptyItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const EmptyItem = ({ title, description, icon }: EmptyItemProps) => {
    return (
        <div css={emptyImageList}>
            <div css={emptyIcon}>{icon}</div>
            <h3 css={emptyImageListHeading}>{title}</h3>
            <p css={emptyImageListDescription}>{description}</p>
        </div>
    );
};

const emptyImageList = css`
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const emptyImageListHeading = css`
    margin-top: 18px;
    color: #303038;
    font-size: 18px;
    font-weight: bold;
`;

const emptyImageListDescription = css`
    margin-top: 8px;
    color: #767678;
    font-size: 15px;
    line-height: 21px;
    text-align: center;
    white-space: pre-line;
`;

const emptyIcon = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
    color: ${COLORS.BACKGROUND.WHITE};
`;

export default EmptyItem;
