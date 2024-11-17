import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import { TripInfoModel } from '@/types/trip';

export const useTripForm = () => {
    const imageDates = JSON.parse(localStorage.getItem('image-date') || '[]');

    const [tripInfo, setTripInfo] = useState<TripInfoModel>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });

    const [isUploading, setIsUploading] = useState(false);

    const { showToast } = useToastStore();
    const { uploadStatus, waitForCompletion, resetUpload } = useUploadStore();

    const { tripId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!tripId) {
            return;
        }

        await tripAPI.createTripInfo(tripId, tripInfo);
        setIsUploading(true);

        await waitForCompletion();

        resetUpload();
        localStorage.removeItem('image-date');
        setIsUploading(false);
        navigate(PATH.TRIPS.ROOT);
        showToast(
            uploadStatus === 'error'
                ? '사진 등록이 실패했습니다. 다시 추가해 주세요.'
                : '새로운 여행이 등록되었습니다.',
        );
    };

    return {
        imageDates,
        tripId,
        isUploading,
        tripInfo,
        setTripInfo,
        handleSubmit,
    };
};
