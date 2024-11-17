import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripEditForm from '@/components/features/trip/TripEditForm';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripEditForm } from '@/hooks/useTripEditForm';
import useUserDataStore from '@/stores/useUserDataStore';

const TripInfoEditPage = () => {
    const { tripData, isLoading, handleInputChange, handleHashtagToggle, handleUpdateTripInfo } = useTripEditForm();

    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);

    const navigate = useNavigate();

    const navigateBeforePage = () => {
        setIsTripInfoEditing(false);
        navigate(PATH.TRIPS.ROOT);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={containerStyle}>
            <div>
                <Header title={PAGE.TRIP_EDIT} isBackButton onBack={navigateBeforePage} />
            </div>
            <main css={mainStyle}>
                <div css={tripFormWrapper}>
                    <TripEditForm
                        tripData={tripData}
                        handleInputChange={handleInputChange}
                        handleHashtagToggle={handleHashtagToggle}
                    />
                </div>
                <Button text={BUTTON.UPDATE_TRIP} onClick={handleUpdateTripInfo} />
            </main>
        </div>
    );
};

const containerStyle = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const tripFormWrapper = css`
    flex: 1;
`;

export default TripInfoEditPage;
