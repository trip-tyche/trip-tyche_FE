import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { getTripList, updateTripInfo } from '@/api/trip';
import { PATH } from '@/constants/path';

export const useTripEditForm = () => {
    const [tripData, setTripData] = useState({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const { tripId } = useParams<{ tripId: string }>();

    useEffect(() => {
        const fetchTripInfo = async () => {
            setIsLoading(true);
            try {
                const data = await getTripList();
                const tripData = data?.trips?.filter((trip) => trip.tripId.toString() === tripId);
                if (tripData) setTripData(tripData[0]);
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTripInfo();
    }, [tripId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTripData((prev) => ({ ...prev, [name]: value }));
    };

    const handleHashtagToggle = (tag: string) => {
        setTripData((prev) => ({
            ...prev,
            hashtags: prev.hashtags.includes(tag) ? prev.hashtags.filter((t) => t !== tag) : [...prev.hashtags, tag],
        }));
    };

    const handleUpdateTripInfo = async () => {
        try {
            await updateTripInfo(tripId!, tripData);
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error update trip data:', error);
        }
    };

    return {
        tripData,
        isLoading,
        handleInputChange,
        handleHashtagToggle,
        handleUpdateTripInfo,
    };
};
