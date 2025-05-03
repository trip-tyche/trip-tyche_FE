import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TripInfoForm from '@/domains/trip/components/TripInfoForm';
import { FORM } from '@/domains/trip/constants';
import { useTripInfo } from '@/domains/trip/hooks/queries';
import { useTripInfoForm } from '@/domains/trip/hooks/useTripInfoForm';
import { TripInfo } from '@/domains/trip/types';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import Spinner from '@/shared/components/common/Spinner';
import UploadingSpinner from '@/shared/components/guide/UploadingSpinner';
import { ROUTES } from '@/shared/constants/paths';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripInfoFormPage = () => {
    const [tripInfo, setTripInfo] = useState<TripInfo>(FORM.INITIAL);
    const showToast = useToastStore((state) => state.showToast);

    const { tripKey } = useParams();
    const { pathname, state: mediaFilesDates } = useLocation();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const isEditing = pathname.includes('edit');

    const { data: beforeTripInfo, isLoading } = useTripInfo(tripKey!, isEditing);
    const { isImageSubmitting, isSubmitting, isFormComplete, submitTripInfo } = useTripInfoForm(isEditing, tripInfo);

    useEffect(() => {
        if (isEditing) {
            if (!beforeTripInfo) return;
            if (!beforeTripInfo.success) {
                showToast(beforeTripInfo?.error as string);
                navigate(-1);
                queryClient.invalidateQueries({ queryKey: ['ticket-info'] });
                return;
            }
            setTripInfo(beforeTripInfo.data);
            return;
        }

        setTripInfo(() => ({
            ...tripInfo,
            mediaFilesDates,
        }));
    }, [beforeTripInfo]);

    if (isLoading || isSubmitting) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header
                title={ROUTES.PATH_TITLE.TRIPS.NEW.INFO}
                isBackButton={isEditing}
                onBack={() => navigate(ROUTES.PATH.TRIP.ROOT)}
            />
            <main css={mainStyle}>
                <TripInfoForm isEditing={isEditing} tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button
                    text={`여행 ${isEditing ? '수정' : '등록'}하기`}
                    onClick={submitTripInfo}
                    disabled={!isFormComplete}
                />
            </main>
            {isImageSubmitting && <UploadingSpinner />}
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

export default TripInfoFormPage;
