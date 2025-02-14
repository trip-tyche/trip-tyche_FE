import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { shareAPI } from '@/api/trips/share';
import Header from '@/components/common/Header';
import Notification from '@/components/features/share/Notification';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';

interface SharedTrip {
    notificationId: number;
    shareId: number;
    message: string;
    status: string;
    createdAt: string;
}

const SharePage = () => {
    const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>();

    const navigate = useNavigate();

    useEffect(() => {
        const getSharedTrips = async () => {
            const userId = localStorage.getItem('userId') || '';
            const result = await shareAPI.getNotifications(userId);

            const sharedTrips = result.data;
            setSharedTrips(sharedTrips);
        };

        getSharedTrips();
    }, []);

    if (!sharedTrips) return;

    return (
        <div css={pageContainer}>
            <Header title={'여행 공유'} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <p css={notificationCount}>
                총<span css={count}>{sharedTrips.length}</span>개의 공유가 있습니다
            </p>
            <div css={content}>
                {sharedTrips.map((trip: SharedTrip) => {
                    return <Notification key={trip.notificationId} notification={trip} />;
                })}
            </div>
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    overflow: auto;
`;

const content = css`
    padding: 0 8px;
`;

const notificationCount = css`
    display: flex;
    align-items: center;
    padding: 16px 12px;
    font-size: 14px;
`;

const count = css`
    color: ${COLORS.PRIMARY};
    font-size: 16px;
    font-weight: bold;
    margin: 0 4px;
`;

export default SharePage;
