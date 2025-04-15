import 'dayjs/locale/ko';
import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { ROUTES } from '@/constants/paths';
import { FORM } from '@/constants/trip';
import { BUTTON } from '@/constants/ui';
import { useTripInfoForm } from '@/domain/trip/hooks/useTripInfoForm';
import { Trip } from '@/domain/trip/types';
import { useTripTicketInfo } from '@/hooks/queries/useTrip';
import useUserDataStore from '@/stores/useUserDataStore';

const TripInfoEditPage = () => {
    const [tripInfo, setTripInfo] = useState<Trip>(FORM.INITIAL);
    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);

    const { isFormComplete, submitTripInfo } = useTripInfoForm('edit', tripInfo);

    const { tripKey } = useParams();
    const navigate = useNavigate();

    const { data: tripInfoData, isLoading } = useTripTicketInfo(tripKey!, !!tripKey && true);

    useEffect(() => {
        if (!tripInfoData) return;
        setTripInfo(tripInfoData);
    }, [tripInfoData]);

    // 이전 페이지로 이동
    const navigateBeforePage = () => {
        // if (mode === 'create') {
        // navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(tripKey!)}`);
        // } else {
        setIsTripInfoEditing(false);
        navigate(ROUTES.PATH.TRIPS.ROOT);
        // }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header title={ROUTES.PATH_TITLE.TRIPS.EDIT} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <TripInfoForm mode='edit' tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text={BUTTON.UPDATE_TRIP} onClick={submitTripInfo} disabled={!isFormComplete} />
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
