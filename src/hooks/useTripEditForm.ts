import { ChangeEvent, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { getTripData, updateTripInfo } from '@/api/trip';
import { PATH } from '@/constants/path';
import { TripFormData } from '@/types/trip';

export const useTripEditForm = () => {
    const [tripData, setTripData] = useState<TripFormData>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { tripId } = useParams<{ tripId: string }>();

    // useEffect(() => {
    //     const fetchTripInfo = async () => {
    //         setIsLoading(true);
    //         try {
    //             if (!tripId) {
    //                 return;
    //             }
    //             const tripData = await getTripData(tripId);

    //             if (!tripData) {
    //                 return;
    //             }
    //             // tripId가 string으로 확실히 존재하는 경우만 setTripData 호출
    //             setTripData({
    //                 ...tripData,
    //                 tripId: tripData.tripId || '', // tripId가 undefined일 경우 빈 문자열로 처리
    //             });
    //         } catch (error) {
    //             console.error('Error fetching trip data:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchTripInfo();
    // }, [tripId]);

    useEffect(() => {
        const fetchTripInfo = async () => {
            setIsLoading(true);
            try {
                if (!tripId) return;
                const fetchedTripData = await getTripData(tripId);
                if (fetchedTripData) {
                    setTripData(fetchedTripData);
                }
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTripInfo();
    }, [tripId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            if (tripId) {
                await updateTripInfo(tripId, tripData);
                navigate(PATH.TRIP_LIST);
            }
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
