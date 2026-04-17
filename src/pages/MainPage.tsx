import { useEffect } from 'react';

import { css } from '@emotion/react';
import { Bell, Settings, Plus, Hand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MovableTripTicket from '@/domains/trip/components/MovableTripTicket';
import TripTicket from '@/domains/trip/components/TripTicket';
import { DEFAULT_TICKET } from '@/domains/trip/constants';
import { useTripTicketList } from '@/domains/trip/hooks/queries';
import { Trip } from '@/domains/trip/types';
import { useSummary } from '@/domains/user/hooks/queries';
import useUserStore from '@/domains/user/stores/useUserStore';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import Button from '@/shared/components/common/Button';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';

const MainPage = () => {
    const login = useUserStore((state) => state.login);
    const logout = useUserStore((state) => state.logout);
    const showToast = useToastStore((state) => state.showToast);

    const { data: userInfoResult, isLoading: isSummaryLoading } = useSummary();
    const shouldFetchTrips = userInfoResult?.success && userInfoResult.data ? true : false;
    const { data: myTrips, isLoading: isTripsLoading } = useTripTicketList(shouldFetchTrips);

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('recentPinPointId');
        sessionStorage.removeItem('imageDates');
    }, []);

    useEffect(() => {
        if (userInfoResult) {
            if (userInfoResult.success) {
                const userInfo = userInfoResult.data;
                login(userInfo);
            } else {
                logout();
                showToast(userInfoResult.error || MESSAGE.ERROR.UNKNOWN);
            }
        }
    }, [userInfoResult, login, logout, showToast]);

    const createNewTrip = async () => {
        const result = await toResult(() => tripAPI.createNewTrip());
        if (result.success) {
            const { tripKey } = result.data;
            navigate(`${ROUTES.PATH.TRIP.NEW(tripKey!)}`);
        } else {
            showToast(result.error);
        }
    };

    if (!userInfoResult || !userInfoResult.success || !userInfoResult.data) return null;

    const { userId, unreadNotificationsCount } = userInfoResult.data || {};
    const sortedTrips = myTrips && myTrips.success ? [...myTrips.data].reverse() : [];
    const tripCount = sortedTrips.length;

    return (
        <div css={page}>
            {(isTripsLoading || isSummaryLoading) && <Indicator text='티켓 정보 불러오는 중...' />}

            <header css={header}>
                <div css={logo}>TRIPTYCHE</div>
                <div css={headerIcons}>
                    <div
                        css={notificationContainer}
                        onClick={() => userId && navigate(ROUTES.PATH.NOTIFICATION(userId))}
                    >
                        <Bell css={notificationIcon} />
                        {!!unreadNotificationsCount && <span css={notificationBadge}>{unreadNotificationsCount}</span>}
                    </div>
                    <Settings css={settingsIcon} onClick={() => navigate(ROUTES.PATH.SETTING)} />
                </div>
            </header>

            <main css={ticketsContainer}>
                <div css={titleRow}>
                    <h2 css={mainTitle}>나의 여행 티켓</h2>
                    <Button css={addButton} onClick={createNewTrip} icon={<Plus size={24} />} />
                </div>

                {tripCount > 0 && <p css={subtitle}>지금까지 {tripCount}장의 티켓을 만들었어요!</p>}

                {tripCount > 0 ? (
                    <div css={tripListContent}>
                        {sortedTrips.map((trip: Trip) => (
                            <TripTicket key={trip.tripKey} tripInfo={trip} />
                        ))}
                    </div>
                ) : (
                    !isTripsLoading && (
                        <div css={emptyTripList}>
                            <p css={touchGuideText}>
                                <Hand size={14} /> 아래 티켓을 움직여보세요!
                            </p>
                            <MovableTripTicket trip={DEFAULT_TICKET} />
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

const page = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f7;
`;

const header = css`
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    padding: 0 16px;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 30;
`;

const logo = css`
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.374px;
    color: #ffffff;
    user-select: none;
`;

const headerIcons = css`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const notificationContainer = css`
    position: relative;
    cursor: pointer;
`;

const notificationIcon = css`
    width: 22px;
    height: 22px;
    color: #ffffff;
    -webkit-tap-highlight-color: transparent;
`;

const notificationBadge = css`
    position: absolute;
    top: -4px;
    right: -2px;
    min-width: 16px;
    height: 16px;
    background-color: #0071e3;
    color: #ffffff;
    font-size: 10px;
    font-weight: 600;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    padding: 0 2px;
`;

const settingsIcon = css`
    width: 22px;
    height: 22px;
    color: #ffffff;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
`;

const ticketsContainer = css`
    flex: 1;
    overflow: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
`;

const titleRow = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

const mainTitle = css`
    font-size: 21px;
    font-weight: 600;
    letter-spacing: 0.231px;
    color: #1d1d1f;
`;

const addButton = css`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: #0071e3;
    box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;
`;

const subtitle = css`
    display: flex;
    align-items: center;
    font-size: 14px;
    letter-spacing: -0.224px;
    color: rgba(0, 0, 0, 0.48);
    margin: 12px 0;
`;

const tripListContent = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const emptyTripList = css`
    flex: 0.8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
`;

const touchGuideText = css`
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.12px;
    color: rgba(0, 0, 0, 0.48);
    display: flex;
    align-items: center;
    gap: 4px;
`;

export default MainPage;
