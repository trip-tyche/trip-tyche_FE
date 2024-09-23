import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { postTripInfo } from '@/api/trip';
import { PATH } from '@/constants/path';
import { getToken } from '@/utils/auth';

export const useTripForm = () => {
    const [tripTitle, setTripTitle] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const token = getToken();
            const response = await postTripInfo({ tripTitle, country, startDate, endDate, hashtags }, token);
            const { tripId } = response;

            navigate(PATH.TRIP_UPLOAD, { state: { tripId, tripTitle } });
        } catch (error) {
            console.error('Error post trip-info:', error);
        }
    };

    return {
        tripTitle,
        setTripTitle,
        country,
        setCountry,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        hashtags,
        setHashtags,
        handleSubmit,
    };
};
