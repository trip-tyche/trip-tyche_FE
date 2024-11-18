import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import UploadingSpinner from '@/components/features/guide/UploadingSpinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import { TripInfoModel } from '@/types/trip';

const TripInfoPage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [tripInfo, setTripInfo] = useState<TripInfoModel>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });

    const uploadStatus = useUploadStore((state) => state.uploadStatus);
    const waitForCompletion = useUploadStore((state) => state.waitForCompletion);
    const showToast = useToastStore((state) => state.showToast);

    const { tripId } = useParams();
    const navigate = useNavigate();

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

    const navigateBeforePage = () => {
        navigate(`${PATH.TRIPS.NEW.IMAGES(Number(tripId))}`);
    };

    return (
        <div css={pageContainer}>
            <Header title={PAGE.NEW_TRIP} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <TripInfoForm mode='create' tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text='여행 등록하기' onClick={handleTripInfoSubmit} disabled={!isFormComplete} />
            </main>
            {isUploading && <UploadingSpinner />}
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
`;

export default TripInfoPage;
