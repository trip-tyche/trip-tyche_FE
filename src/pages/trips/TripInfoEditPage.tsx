import 'dayjs/locale/ko';
import { css } from '@emotion/react';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripForm } from '@/hooks/useTripForm';

const TripInfoEditPage = () => {
    const { tripInfo, setTripInfo, isLoading, isFormComplete, handleTripInfoSubmit, navigateBeforePage } =
        useTripForm('edit');

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header title={PAGE.TRIP_EDIT} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <TripInfoForm mode='edit' tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text={BUTTON.UPDATE_TRIP} onClick={handleTripInfoSubmit} disabled={!isFormComplete} />
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
