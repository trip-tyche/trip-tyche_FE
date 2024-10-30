import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { postTripInfo } from '@/api/trip';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';

export const useTripForm = () => {
    const [tripTitle, setTripTitle] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);

    const { showToast } = useToastStore();

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const tripId = localStorage.getItem('tripId');
            if (!tripId) {
                return;
            }

            const response = await postTripInfo({ tripId, tripTitle, country, startDate, endDate, hashtags });
            console.log(response);

            navigate(PATH.TRIP_LIST);
            showToast('사진이 업로드되었습니다.');
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
