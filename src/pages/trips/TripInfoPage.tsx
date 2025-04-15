import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import UploadingSpinner from '@/components/features/guide/UploadingSpinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { ROUTES } from '@/constants/paths';
import { FORM } from '@/constants/trip';
import { useTripInfoForm } from '@/domain/trip/hooks/useTripInfoForm';
import { Trip } from '@/domain/trip/types';

const TripInfoPage = () => {
    const [tripInfo, setTripInfo] = useState<Trip>(FORM.INITIAL);
    const { isSubmitting, isFormComplete, submitTripInfo } = useTripInfoForm('create', tripInfo);

    const { state: mediaFilesDates } = useLocation();

    const { tripKey } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!tripInfo) return;
        setTripInfo(() => {
            return {
                ...tripInfo,
                mediaFilesDates,
            };
        });
        // }
    }, [mediaFilesDates]);

    // 이전 페이지로 이동
    const navigateBeforePage = () => {
        // if (mode === 'create') {
        navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(tripKey!)}`);
        // } else {
        // setIsTripInfoEditing(false);
        // navigate(ROUTES.PATH.TRIPS.ROOT);
        // }
    };

    return (
        <div css={pageContainer}>
            <Header title={ROUTES.PATH_TITLE.TRIPS.NEW.INFO} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <TripInfoForm mode='create' tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text='여행 등록하기' onClick={submitTripInfo} disabled={!isFormComplete} />
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
