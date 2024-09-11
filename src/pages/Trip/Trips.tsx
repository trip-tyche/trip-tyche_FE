// import { css } from '@emotion/react';
// import Navbar from '@/components/common/Navbar';
// import Header from '@/components/layout/Header/Header';
// import Button from '@/components/common/Button/Button';
// import { useNavigate } from 'react-router-dom';
// import BorderPass from '@/components/BorderPass';

// export default function TripList() {
//     const navigator = useNavigate();

//     const goToTripCreatePage = () => {
//         navigator('/trips/new');
//     };

//     return (
//         <div css={containerStyle}>
//             <main css={mainContentStyle}>
//                 <Header title='여행관리' />
//                 <div css={buttonStyle}>
//                     <Button text='여행 등록' theme='sec' size='sm' onClick={goToTripCreatePage} />
//                 </div>
//                 <div css={tripListStyle}>
//                     <BorderPass />
//                     <BorderPass />
//                     <BorderPass />
//                     <BorderPass />
//                 </div>
//             </main>

//             <Navbar />
//         </div>
//     );
// }
import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { fetchTripsList } from '@/api/trips';
import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import BorderPass from '@/components/pages/BorderPass';
import theme from '@/styles/theme';

// 인터페이스 정의
interface Trip {
    tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

interface TripList {
    userNickName: string;
    trips: Trip[];
}

interface FormattedTrip extends Omit<Trip, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string;
}

const Trips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [userNickName, setUserNickName] = useState<string>('');

    const formatTrips = (tripsData: Trip[]): FormattedTrip[] =>
        tripsData.map((trip) => ({
            ...trip,
            country: trip.country.toUpperCase(),
            startDate: new Date(trip.startDate).toLocaleDateString('ko-KR'),
            endDate: new Date(trip.endDate).toLocaleDateString('ko-KR'),
        }));

    useEffect(() => {
        const getTripsList = async () => {
            const tripList = await fetchTripsList();
            setTrips(tripList.trips);
            setUserNickName(tripList.userNickName);
        };

        getTripsList();
    }, []);

    const goToTripCreatePage = () => {
        navigate('/trips/create-info');
    };

    return (
        <div css={containerStyle}>
            <div css={fixedHeaderStyle}>
                <Header title='여행관리' />
                <div css={buttonStyle}>
                    <Button text='여행 등록' theme='sec' size='sm' onClick={goToTripCreatePage} />
                </div>
            </div>
            <main css={mainContentStyle}>
                <div css={tripListStyle}>
                    {formatTrips(trips).map((trip) => (
                        <BorderPass key={trip.tripId} trip={trip} userNickName={userNickName} />
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
    max-width: 498px;
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
