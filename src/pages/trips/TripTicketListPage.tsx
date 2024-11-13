import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane, PlaneTakeoff } from 'lucide-react';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import Button from '@/components/common/button/Button';
import Loading from '@/components/common/Loading';
import Header from '@/components/layout/Header';
import BorderPass from '@/components/pages/trip-list/BorderPass';
import { TRIP } from '@/constants/message';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { Trip, Trips } from '@/types/trip';
import { formatTripDate } from '@/utils/date';

const TripTicketListPage = () => {
    const [userNickname, setUserNickname] = useState<string>('');
    const [tripList, setTripList] = useState<Trip[]>([]);
    const [tripCount, setTripCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToastStore();
    const setLogout = useAuthStore((state) => state.setLogout);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTripList = async () => {
            try {
                setIsLoading(true);
                const tripList: Trips = await tripAPI.fetchTripTicketList();

                if (typeof tripList !== 'object') {
                    showToast('다시 로그인해주세요.');
                    setLogout();
                    navigate(PATH.AUTH.LOGIN);
                    return;
                }

                if (tripList.trips.some((trip) => trip.tripTitle === 'N/A')) {
                    await deleteInValidTrips(tripList.trips);
                }

                const validTripList = tripList.trips?.filter((trip) => trip.tripTitle !== 'N/A');

                setUserNickname(tripList.userNickName);
                setTripList(validTripList);
                setTripCount(validTripList.length);
            } catch (error) {
                console.error('Error fetching trip-list data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        localStorage.removeItem('tripId');
        localStorage.removeItem('earliest-date');
        localStorage.removeItem('latest-date');
        localStorage.removeItem('image-date');

        fetchTripList();
    }, [tripCount]);

    const deleteInValidTrips = async (trips: Trip[]) => {
        const deletePromises = trips
            .filter((trip) => trip.tripTitle === 'N/A')
            .map((trip) => tripAPI.deleteTripTicket(trip.tripId));

        return await Promise.allSettled(deletePromises);
    };

    if (isLoading) {
        <Loading />;
    }

    const handleTicketCreate = async () => {
        const tripId = await tripAPI.createTrip();
        navigate(`${PATH.TRIPS.NEW.IMAGES(tripId)}`);
    };

    return (
        <div css={containerStyle}>
            <Header title={PAGE.TRIP_LIST} isBackButton onBack={() => navigate(PATH.MAIN)} />
            {isLoading ? (
                <div css={loadingWrapper}>
                    <Loading />
                </div>
            ) : (
                <>
                    <div css={addTripStyle}>
                        {tripCount === 0 ? (
                            <div css={countStyle}>아직 만든 티켓이 없어요!</div>
                        ) : (
                            <div css={countStyle}>
                                <TicketsPlane size={20} /> <span>{tripCount}</span> 개의 티켓을 만들었어요!
                            </div>
                        )}

                        <div>
                            <Button text={BUTTON.NEW_TRIP} btnTheme='pri' size='sm' onClick={handleTicketCreate}>
                                <Button.Left>
                                    <LuPlus size={16} />
                                </Button.Left>
                            </Button>
                        </div>
                    </div>
                    {tripCount > 0 ? (
                        <div css={tripListStyle}>
                            {formatTripDate(tripList).map((trip) => (
                                <BorderPass
                                    key={trip.tripId}
                                    trip={trip}
                                    userNickname={userNickname}
                                    setTripCount={setTripCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div css={noTripListStyle}>
                            <PlaneTakeoff />
                            <p>{TRIP.NO_TRIP}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const containerStyle = css`
    position: relative;
    height: 100dvh;
    overflow: auto;
`;

const loadingWrapper = css`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const addTripStyle = css`
    display: flex;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 8px;
    height: 54px;
`;

const countStyle = css`
    margin-left: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.black};

    span {
        font-size: 18px;
        font-weight: 600;
        color: ${theme.colors.primary};
        margin: 0 2px 0 8px;
    }
`;

const tripListStyle = css`
    display: flex;
    flex-direction: column;
    margin: 0 8px;
    padding-bottom: 10px;
`;

const noTripListStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    height: calc(100dvh - 144px);
    font-size: ${theme.fontSizes.normal_14};
    font-weight: 600;
    color: ${theme.colors.descriptionText};
`;

export default TripTicketListPage;