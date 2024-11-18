import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { TripInfoModel } from '@/types/trip';

import 'dayjs/locale/ko';

const TripInfoEditPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [tripInfo, setTripInfo] = useState<TripInfoModel>({
        tripTitle: '',
        country: '',
        startDate: '',
        endDate: '',
        hashtags: [],
    });

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

    useEffect(() => {
        const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;
        if (hashtags.length > 0 && tripTitle && country && startDate && endDate) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

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
        setIsTripInfoEditing(false);
        navigate(PATH.TRIPS.ROOT);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header title={PAGE.TRIP_EDIT} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <TripInfoForm mode='edit' tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text={BUTTON.UPDATE_TRIP} onClick={handleTripInfoUpdate} disabled={!isFormComplete} />
            </main>
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

export default TripInfoEditPage;
