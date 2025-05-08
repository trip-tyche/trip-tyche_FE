import { css } from '@emotion/react';

import { COLORS } from '@/shared/constants/theme';

type MessageType = 'SHARED_APPROVE' | 'SHARED_REJECTED';

const MESSAGE = {
    SHARED_APPROVE: '수락됨',
    SHARED_REJECTED: '거절됨',
};

const Badge = ({ message }: { message: MessageType }) => {
    const isSuccess = message === 'SHARED_APPROVE';
    return <span css={badge(isSuccess)}>{MESSAGE[message]}</span>;
};

const badge = (isSuccess: boolean) => css`
    padding: 2px 8px;
    background-color: ${isSuccess ? COLORS.ALERT.SUCCESS.BACKGROUND : COLORS.ALERT.ERROR.BACKGROUND};
    color: ${isSuccess ? COLORS.ALERT.SUCCESS.TEXT : COLORS.ALERT.ERROR.TEXT};
    font-size: 12px;
    border-radius: 9999px;
`;

export default Badge;
