import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import UploadingSpinner from '@/components/guide/UploadingSpinner';
import TripInfoForm from '@/domain/trip/components/TripInfoForm';
import { ROUTES } from '@/constants/paths';
import { FORM } from '@/constants/trip';
import { useTripInfo } from '@/domain/trip/hooks/queries';
import { useTripInfoForm } from '@/domain/trip/hooks/useTripInfoForm';
import { TripInfo } from '@/domain/trip/types';
import { useToastStore } from '@/stores/useToastStore';

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
                isBackButton
                onBack={() =>
                    navigate(isEditing ? ROUTES.PATH.TRIP.ROOT : `${ROUTES.PATH.TRIP.MANAGEMENT.UPLOAD(tripKey!)}`)
                }
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
