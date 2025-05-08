import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

type BadgeType = 'SUCCESS' | 'ERROR';

const MESSAGE = {
    SUCCESS: '수락됨',
    ERROR: '거절됨',
};

const Badge = ({ type }: { type: BadgeType }) => {
    return <span css={acceptedBadge(type)}>{MESSAGE[type]}</span>;
};

const acceptedBadge = (type: BadgeType) => css`
    margin-left: 8px;
    padding: 2px 8px;
    background-color: ${type === 'SUCCESS' ? COLORS.ALERT.SUCCESS.BACKGROUND : COLORS.ALERT.ERROR.BACKGROUND};
    color: ${type === 'SUCCESS' ? COLORS.ALERT.SUCCESS.TEXT : COLORS.ALERT.ERROR.TEXT};
    font-size: 12px;
    border-radius: 9999px;
`;

export default Badge;
