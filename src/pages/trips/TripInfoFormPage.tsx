import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import UploadingSpinner from '@/components/features/guide/UploadingSpinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { ROUTES } from '@/constants/paths';
import { FORM } from '@/constants/trip';
import { useTripInfoForm } from '@/domain/trip/hooks/useTripInfoForm';
import { Trip } from '@/domain/trip/types';
import { useTripTicketInfo } from '@/hooks/queries/useTrip';

const TripInfoPage = () => {
    const [tripInfo, setTripInfo] = useState<Trip>(FORM.INITIAL);

    const { tripKey } = useParams();
    const { pathname, state: mediaFilesDates } = useLocation();
    const navigate = useNavigate();

    const isEditing = pathname.includes('edit');

    const { data: beforeTripInfo, isLoading } = useTripTicketInfo(tripKey!, !!tripKey && isEditing);
    const { isSubmitting, isFormComplete, submitTripInfo } = useTripInfoForm(isEditing, tripInfo);

    useEffect(() => {
        if (isEditing) {
            if (!beforeTripInfo) return;
            setTripInfo(beforeTripInfo);
        }
        setTripInfo(() => {
            return {
                ...tripInfo,
                mediaFilesDates,
            };
        });
    }, [beforeTripInfo]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header
                title={ROUTES.PATH_TITLE.TRIPS.NEW.INFO}
                isBackButton
                onBack={() =>
                    navigate(isEditing ? ROUTES.PATH.TRIPS.ROOT : `${ROUTES.PATH.TRIPS.NEW.IMAGES(tripKey!)}`)
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
            {isSubmitting && <UploadingSpinner />}
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
