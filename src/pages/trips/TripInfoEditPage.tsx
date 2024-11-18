import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripEditForm from '@/components/features/trip/TripEditForm';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripEdit } from '@/hooks/useTripEdit';
import useUserDataStore from '@/stores/useUserDataStore';

const TripInfoEditPage = () => {
    const [isFormComplete, setIsFormComplete] = useState(false);

    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);

    const { tripInfo, isLoading, setTripInfo, handleTripInfoUpdate } = useTripEdit();

    const navigate = useNavigate();

    useEffect(() => {
        const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;
        if (hashtags.length > 0 && tripTitle && country && startDate && endDate) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    const navigateBeforePage = () => {
        setIsTripInfoEditing(false);
        navigate(PATH.TRIPS.ROOT);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <div>
                <Header title={PAGE.TRIP_EDIT} isBackButton onBack={navigateBeforePage} />
            </div>
            <main css={mainStyle}>
                <TripEditForm tripInfo={tripInfo} setTripInfo={setTripInfo} />
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
