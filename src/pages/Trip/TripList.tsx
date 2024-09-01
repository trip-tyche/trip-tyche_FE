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

import BorderPass from '@/components/BorderPass';
import Button from '@/components/common/Button/Button';
import Navbar from '@/components/common/Navbar';
import Header from '@/components/layout/Header/Header';

// 인터페이스 정의
interface Trip {
    tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}

interface UserData {
    userNickName: string;
    trips: Trip[];
}

interface FormattedTrip extends Omit<Trip, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string;
}

const TripList = () => {
    const navigator = useNavigate();
    const [trips, setTrips] = useState<FormattedTrip[]>([]);
    const [userNickName, setUserNickName] = useState<string>('');

    const formatTrips = (tripsData: Trip[]): FormattedTrip[] =>
        tripsData.map((trip) => ({
            ...trip,
            country: trip.country.toUpperCase(),
            startDate: new Date(trip.startDate).toLocaleDateString('ko-KR'),
            endDate: new Date(trip.endDate).toLocaleDateString('ko-KR'),
        }));

    const fetchUserData = async (): Promise<void> => {
        try {
            const response = await axios.get<UserData>('/server/getTrips.json');
            const formattedTrips = formatTrips(response.data.trips);
            setTrips(formattedTrips);
            setUserNickName(response.data.userNickName);
        } catch (error) {
            console.error('Failed to fetch user data: ', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const goToTripCreatePage = () => {
        navigator('/trips/new');
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
                    {trips.map((trip) => (
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
    max-width: 430px;
    top: 0;
    background-color: #fff;
    z-index: 1000;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
    /* background-color: transparent; */
`;

const mainContentStyle = css`
    flex: 1;
    margin-bottom: 6rem;

    margin-top: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const buttonStyle = css`
    display: flex;
    justify-content: end;
    background-color: transparent;
    padding: 1.5rem;
`;

const tripListStyle = css`
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 18px;
    padding: 10px;
`;

export default TripList;
