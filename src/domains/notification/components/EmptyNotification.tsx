import { css } from '@emotion/react';
import { BellOff } from 'lucide-react';

import { COLORS } from '@/shared/constants/theme';

const EmptyNotification = () => {
    return (
        <div css={emptyNotificationStyle}>
            <div css={belloffIcon}>
                <BellOff color='white' />
            </div>
            <h3 css={emptyNotificationHeading}>새로운 알림이 없습니다</h3>
            <p css={emptyNotificationDescription}>{`트립티케의 다양한 알림을\n이곳에서 모아볼 수 있어요`}</p>
        </div>
    );
};

const emptyNotificationStyle = css`
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const belloffIcon = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
`;

const emptyNotificationHeading = css`
    margin-top: 18px;
    color: #303038;
    font-size: 18px;
    font-weight: bold;
`;

const emptyNotificationDescription = css`
    margin-top: 8px;
    color: #767678;
    font-size: 15px;
    line-height: 21px;
    text-align: center;
    white-space: pre-line;
`;

export default EmptyNotification;
