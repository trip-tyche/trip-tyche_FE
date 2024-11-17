import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import { TripInfoModel } from '@/types/trip';

export const useTripForm = () => {
    const imageDates = JSON.parse(localStorage.getItem('image-date') || '');

    const [tripTitle, setTripTitle] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);

    const [tripInfo, setTripInfo] = useState<TripInfoModel>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });

    const [isUploading, setIsUploading] = useState(false);

    const { showToast } = useToastStore();
    const { waitForCompletion, resetUpload } = useUploadStore();

    const { tripId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            if (!tripId) {
                return;
            }

            await tripAPI.createTripInfo(tripId, tripInfo);
            setIsUploading(true);

            try {
                await waitForCompletion(); // 업로드 완료될 때까지 대기
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                return;
            }

            resetUpload();
            navigate(PATH.TRIPS.ROOT);
            showToast('새로운 여행이 등록되었습니다.');
            // localStorage.removeItem('image-date');
        } catch (error) {
            console.error('여행정보 등록 중 오류 발생', error);
        } finally {
            setIsUploading(false);
        }
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
