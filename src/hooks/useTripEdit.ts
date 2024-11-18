import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { TripInfoModel } from '@/types/trip';

export const useTripEdit = (isEditing: boolean) => {
    const [tripInfo, setTripInfo] = useState<TripInfoModel>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);

    const uploadStatus = useUploadStore((state) => state.uploadStatus);
    const waitForCompletion = useUploadStore((state) => state.waitForCompletion);
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

        isEditing && getTripInfoData();
    }, [tripId, isEditing, showToast]);

    useEffect(() => {
        const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;
        if (hashtags.length > 0 && tripTitle && country && startDate && endDate) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    const handleTripInfoSubmit = async () => {
        if (!tripId) {
            return;
        }

        await tripAPI.createTripInfo(tripId, tripInfo);
        setIsUploading(true);

        await waitForCompletion();

        localStorage.removeItem('image-date');
        setIsUploading(false);
        navigate(PATH.TRIPS.ROOT);
        showToast(
            uploadStatus === 'error'
                ? '사진 등록이 실패했습니다. 다시 추가해 주세요.'
                : '새로운 여행이 등록되었습니다.',
        );
    };

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

    const navigateBeforePage = () => {
        if (isEditing) {
            setIsTripInfoEditing(false);
            navigate(PATH.TRIPS.ROOT);
        } else {
            navigate(`${PATH.TRIPS.NEW.IMAGES(Number(tripId))}`);
        }
    };

    return isEditing
        ? { tripId, tripInfo, isUploading, isFormComplete, setTripInfo, handleTripInfoSubmit, navigateBeforePage }
        : { tripInfo, isLoading, isFormComplete, setTripInfo, handleTripInfoUpdate, navigateBeforePage };
};
