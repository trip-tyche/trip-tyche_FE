import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { fetchTripMapData } from '@/api/trips';
import Header from '@/components/layout/Header';

const TripMap = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state;

    useEffect(() => {
        const getTripMapData = async () => {
            const tripMapData = await fetchTripMapData(trip.tripId);
            console.log(tripMapData);
        };

        getTripMapData();
    }, []);

    return (
        <div>
            <Header title={`${trip.tripTitle}`} isBackButton onClick={() => navigate('/trips')} />
        </div>
    );
};

export default TripMap;
