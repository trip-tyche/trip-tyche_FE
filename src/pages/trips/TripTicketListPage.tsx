import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane, PlaneTakeoff } from 'lucide-react';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripTicket from '@/components/features/trip/TripTicket';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { Trip, Trips } from '@/types/trip';

const TripTicketListPage = () => {
    const [userNickname, setUserNickname] = useState('');
    const [tripList, setTripList] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const tripTicketCount = useUserDataStore((state) => state.tripTicketCount);
    const setTripTicketCount = useUserDataStore((state) => state.setTripTicketCount);

    const navigate = useNavigate();

    useEffect(() => {
        getTripListData();
    }, [tripTicketCount]);

    const getTripListData = async () => {
        setIsLoading(true);
        const tripList: Trips = await tripAPI.fetchTripTicketList();
        const inValidTripList = tripList.trips.filter((trip) => trip.tripTitle === 'N/A');
        const validTripList = tripList.trips?.filter((trip) => trip.tripTitle !== 'N/A');

        if (inValidTripList.length > 3) {
            await deleteInValidTrips(tripList.trips);
        }

        setUserNickname(tripList.userNickName);
        setTripList(validTripList);
        setTripTicketCount(validTripList.length);
        setIsLoading(false);
    };

    const deleteInValidTrips = async (trips: Trip[]) => {
        const deletePromises = trips
            .filter((trip) => trip.tripTitle === 'N/A')
            .map((trip) => tripAPI.deleteTripTicket(trip.tripId));

        return await Promise.allSettled(deletePromises);
    };

    const handleTicketCreate = async () => {
        const tripId = await tripAPI.createTrip();
        navigate(`${PATH.TRIPS.NEW.IMAGES(tripId)}`);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header title={PAGE.TRIP_LIST} isBackButton onBack={() => navigate(PATH.MAIN)} />

            <div css={listHeaderStyle}>
                <div css={listSummaryStyle}>
                    <TicketsPlane size={20} />
                    {tripTicketCount ? (
                        <p>
                            <span css={listCountStyle}>{tripTicketCount}</span> 장의 티켓을 만들었어요!
                        </p>
                    ) : (
                        <p>아직 만든 티켓이 없어요!</p>
                    )}
                </div>
                <Button
                    text={BUTTON.NEW_TRIP}
                    onClick={handleTicketCreate}
                    icon={<LuPlus size={16} />}
                    css={css`
                        width: auto;
                        height: 34px;
                        padding: 0 12px;
                        border-radius: 8px;
                        font-size: ${theme.fontSizes.small_12};
                    `}
                />
            </div>

            <p css={guideStyle}>* 티켓을 클릭하시면 해당 여행의 타임라인으로 이동합니다.</p>

            {tripTicketCount > 0 ? (
                <div css={tripListStyle}>
                    {tripList.map((trip) => (
                        <TripTicket key={trip.tripId} trip={trip} userNickname={userNickname} />
                    ))}
                </div>
            ) : (
                <div css={emptyTripListStyle}>
                    <PlaneTakeoff size={24} />
                    <p>등록된 여행이 아직 없습니다.</p>
                </div>
            )}
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    overflow: auto;
`;

const listHeaderStyle = css`
    display: flex;
    justify-content: space-between;
    padding: 12px 12px 0 12px;
`;

const listSummaryStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
    font-size: ${theme.fontSizes.normal_14};
    font-weight: bold;
    color: ${theme.colors.black};
`;

const listCountStyle = css`
    font-size: ${theme.fontSizes.xlarge_18};
    font-weight: bold;
    color: ${theme.colors.primary};
`;

const guideStyle = css`
    font-size: ${theme.fontSizes.small_12};
    color: ${theme.colors.descriptionText};
    padding: 24px 12px 8px 16px;
    margin-bottom: 12px;
`;

const tripListStyle = css`
    display: flex;
    flex-direction: column;
    margin: 0 12px;
`;

const emptyTripListStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    height: calc(100dvh - 180px);
    font-size: ${theme.fontSizes.normal_14};
    font-weight: bold;
    color: ${theme.colors.descriptionText};
`;

export default TripTicketListPage;
