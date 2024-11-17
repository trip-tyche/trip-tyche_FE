import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { TripInfoModel } from '@/types/trip';

export const useTripEdit = () => {
    const [tripInfo, setTripInfo] = useState<TripInfoModel>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const showToast = useToastStore((state) => state.showToast);

    const { tripId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getTripInfoData = async () => {
            if (!tripId) {
                return;
            }

            try {
                setIsLoading(true);
                const tripInfo = await tripAPI.fetchTripTicketInfo(tripId);
                const { tripId: _, ...rest } = tripInfo;

                setIsLoading(false);
                setTripInfo(rest);
            } catch (error) {
                showToast('오류가 발생했습니다. 다시 시도해주세요.');
            }
        };

        getTripInfoData();
    }, [tripId, showToast]);

    const handleTripInfoUpdate = async () => {
        try {
            if (tripId) {
                await tripAPI.updateTripInfo(tripId, tripInfo);
                showToast('여행 정보가 성공적으로 수정되었습니다.');
            }
        } catch (error) {
            showToast('여행 정보 수정에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            navigate(PATH.TRIPS.ROOT);
            setIsTripInfoEditing(false);
        }
    };

    return {
        tripInfo,
        isLoading,
        setTripInfo,
        handleTripInfoUpdate,
    };
};
