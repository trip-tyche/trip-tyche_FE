import { useEffect, useState } from 'react';

import { css, keyframes } from '@emotion/react';
import { Bell, Globe, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import TripTicket from '@/domains/trip/components/TripTicket';
import { useTripTicketList } from '@/domains/trip/hooks/queries';
import { Trip } from '@/domains/trip/types';
import { useShareModalStore } from '@/domains/share/stores/useShareModalStore';
import { useSummary } from '@/domains/user/hooks/queries';
import useUserStore from '@/domains/user/stores/useUserStore';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import Button from '@/shared/components/common/Button';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { MESSAGE } from '@/shared/constants/ui';
import { useMapScript } from '@/shared/hooks/useMapScript';
import { useToastStore } from '@/shared/stores/useToastStore';

const MainPage = () => {
    const login = useUserStore((state) => state.login);
    const logout = useUserStore((state) => state.logout);
    const isGuest = useUserStore((state) => state.isGuest);
    const showToast = useToastStore((state) => state.showToast);
    useMapScript(); // TripRoutePage 진입 전 Google Maps 스크립트 백그라운드 로드

    const { data: userInfoResult, isLoading: isSummaryLoading } = useSummary();

    // 페이지 첫 렌더링 완료 후 trip 목록 fetch — 렌더링 전에 BE 트리거가 발화하는 것을 방지
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const shouldFetchTrips = mounted && userInfoResult?.success && userInfoResult.data ? true : false;
    const { data: myTrips, isLoading: isTripsLoading } = useTripTicketList(shouldFetchTrips);

    const setTicketPageReady = useShareModalStore((state) => state.setTicketPageReady);
    const isModalOpen = useShareModalStore((state) => state.isModalOpen);
    const [pendingCheckDone, setPendingCheckDone] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('recentPinPointId');
        sessionStorage.removeItem('imageDates');
    }, []);

    useEffect(() => {
        if (userInfoResult) {
            if (userInfoResult.success) {
                login(userInfoResult.data);
            } else {
                logout();
                showToast(userInfoResult.error || MESSAGE.ERROR.UNKNOWN);
            }
        }
    }, [userInfoResult, login, logout, showToast]);

    useEffect(() => {
        if (!document.getElementById('outfit-font')) {
            const link = document.createElement('link');
            link.id = 'outfit-font';
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    useEffect(() => {
        if (!myTrips?.success) return;
        setTicketPageReady();
        setPendingCheckDone(true);
    }, [myTrips, setTicketPageReady]);

    const createNewTrip = async () => {
        const result = await toResult(() => tripAPI.createNewTrip());
        if (result.success) {
            const { tripKey } = result.data;
            navigate(`${ROUTES.PATH.TRIP.NEW(tripKey!)}`);
        } else {
            showToast(result.error);
        }
    };

    if (!userInfoResult) {
        return (
            <div css={page}>
                <header css={header}>
                    <span css={logo}>TRIPTYCHE</span>
                    <div css={headerIcons}>
                        <div css={iconBtnWrap}><Globe css={iconBtn} /></div>
                        <div css={iconBtnWrap}><Bell css={iconBtn} /></div>
                        <div css={iconBtnWrap}><Settings css={iconBtn} /></div>
                    </div>
                </header>
                <main css={main}>
                    <div css={titleBlock}>
                        <h2 css={mainTitle}>나의 여행 티켓</h2>
                    </div>
                    <div css={skeletonList}>
                        {[1, 2].map((i) => <div key={i} css={skeletonCard} aria-hidden="true" />)}
                    </div>
                </main>
            </div>
        );
    }

    if (!userInfoResult.success || !userInfoResult.data) return null;

    const { userId, unreadNotificationsCount } = userInfoResult.data;
    const sortedTrips = myTrips && myTrips.success ? [...myTrips.data].reverse() : [];
    const tripCount = sortedTrips.length;

    if (!isTripsLoading && myTrips && tripCount === 0) {
        navigate(ROUTES.PATH.HOME, { replace: true });
        return null;
    }

    return (
        <div css={page}>
            {(isTripsLoading || isSummaryLoading) && <Indicator text='티켓 정보 불러오는 중...' />}

            <header css={header}>
                <span css={logo}>TRIPTYCHE</span>
                <div css={headerIcons}>
                    <button
                        css={iconBtnWrap}
                        onClick={() => navigate(ROUTES.PATH.HOME)}
                        aria-label="지구본"
                    >
                        <Globe css={iconBtn} />
                    </button>
                    <button
                        css={iconBtnWrap}
                        onClick={() => userId && navigate(ROUTES.PATH.NOTIFICATION(userId))}
                        aria-label="알림"
                    >
                        <Bell css={iconBtn} />
                        {!!(pendingCheckDone && !isModalOpen && unreadNotificationsCount) && (
                            <span css={badge}>{unreadNotificationsCount}</span>
                        )}
                    </button>
                    <button
                        css={iconBtnWrap}
                        onClick={() => navigate(ROUTES.PATH.SETTING)}
                        aria-label="설정"
                    >
                        <Settings css={iconBtn} />
                    </button>
                </div>
            </header>

            <main css={main}>
                <div css={titleRow}>
                    <div>
                        <h2 css={mainTitle}>나의 여행 티켓</h2>
                        {tripCount > 0 && (
                            <p css={subtitle}>
                                지금까지 <strong css={countAccent}>{tripCount}장</strong>의 티켓을 만들었어요
                            </p>
                        )}
                    </div>
                    {!isGuest && <Button css={addButton} onClick={createNewTrip} icon={<Plus size={22} />} />}
                </div>

                <div css={tripList}>
                    {sortedTrips.map((trip: Trip, i: number) => (
                        <div key={trip.tripKey} css={tripItem(i)}>
                            <TripTicket tripInfo={trip} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MainPage;

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0);     }
`;

const cardEnter = keyframes`
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const shimmer = keyframes`
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
`;

const page = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: 'Outfit', -apple-system, 'SF Pro Text', sans-serif;
`;

const header = css`
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0 20px;
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 30;
    animation: ${slideDown} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const logo = css`
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #0071e3;
    user-select: none;
`;

const headerIcons = css`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const iconBtnWrap = css`
    position: relative;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s ease;
    @media (hover: hover) {
        &:hover { background: rgba(0, 0, 0, 0.05); }
    }
    &:active { background: rgba(0, 0, 0, 0.08); transform: scale(0.9); }
`;

const iconBtn = css`
    width: 20px;
    height: 20px;
    color: #475569;
`;

const badge = css`
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 14px;
    height: 14px;
    background: #0071e3;
    color: #ffffff;
    font-size: 9px;
    font-weight: 700;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
`;

const main = css`
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px 32px;
    display: flex;
    flex-direction: column;
`;

const titleBlock = css`
    margin-bottom: 20px;
`;

const titleRow = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
`;

const mainTitle = css`
    font-family: 'Outfit', sans-serif;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #0f172a;
    line-height: 1.1;
    margin-bottom: 5px;
`;

const subtitle = css`
    font-size: 13px;
    color: #94a3b8;
    letter-spacing: -0.1px;
    font-family: 'Outfit', sans-serif;
`;

const countAccent = css`
    color: #0071e3;
    font-weight: 700;
`;

const addButton = css`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #0071e3;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    @media (hover: hover) {
        &:hover {
            transform: scale(1.07);
            box-shadow: 0 8px 24px rgba(0, 113, 227, 0.45);
        }
    }
    &:active {
        transform: scale(0.93);
        box-shadow: 0 2px 8px rgba(0, 113, 227, 0.25);
    }
`;

const tripList = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const tripItem = (i: number) => css`
    animation: ${cardEnter} 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.07}s both;
`;

const skeletonList = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
`;

const skeletonCard = css`
    width: 100%;
    height: 156px;
    border-radius: 18px;
    background: linear-gradient(90deg, #e8eef4 0%, #f3f7fb 40%, #e8eef4 80%);
    background-size: 400% 100%;
    animation: ${shimmer} 1.8s ease-in-out infinite;
    @media (prefers-reduced-motion: reduce) {
        animation: none;
        background: #e8eef4;
    }
`;
