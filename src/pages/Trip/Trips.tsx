import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { fetchTripsList } from '@/api/trip';
import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import BorderPass from '@/components/pages/BorderPass';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';
import { FormattedTrip, Trip } from '@/types/trip';
import { getToken } from '@/utils/auth';

const Trips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [userNickname, setUserNickname] = useState<string>('');
    const [tripCount, setTripCount] = useState(0);
    const token = getToken();

    const formatTrips = (tripsData: Trip[]): FormattedTrip[] =>
        tripsData?.map((trip) => ({
            ...trip,
            country: trip.country.toUpperCase(),
            startDate: new Date(trip.startDate).toLocaleDateString('ko-KR'),
            endDate: new Date(trip.endDate).toLocaleDateString('ko-KR'),
        }));

    useEffect(() => {
        const getTripsList = async () => {
            const tripList = await fetchTripsList(token);
            if (!tripList) {
                return;
            }
            console.log(tripList);

            setTrips(tripList.trips);
            setUserNickname(tripList.userNickName);
            setTripCount(tripList.trips?.length);
        };

        getTripsList();
    }, [tripCount]);

    const goToTripCreatePage = () => {
        navigate(PATH.TRIP_CREATE_INFO);
    };

    return (
        <div css={containerStyle}>
            <div css={fixedHeaderStyle}>
                <Header title='보더 패스' />
                <div css={buttonStyle}>
                    <Button text='여행 등록' theme='sec' size='sm' onClick={goToTripCreatePage} />
                </div>
            </div>
            <main css={mainContentStyle}>
                <div css={tripListStyle}>
                    {formatTrips(trips)?.map((trip) => (
                        <BorderPass
                            key={trip.tripId}
                            trip={trip}
                            userNickname={userNickname}
                            setTripCount={setTripCount}
                        />
                    ))}
                </div>
            </main>
            <Navbar />
        </div>
    );
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const fixedHeaderStyle = css`
    position: fixed;
    width: 100%;
    max-width: 428px;
    background-color: ${theme.colors.white};
    z-index: 1000;
`;

const buttonStyle = css`
    display: flex;
    justify-content: end;
    padding: 0.5rem;
    padding-right: 1rem;
`;

const mainContentStyle = css`
    flex: 1;
    padding-bottom: 90px;

    margin-top: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const tripListStyle = css`
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 10px;
`;

export default Trips;
