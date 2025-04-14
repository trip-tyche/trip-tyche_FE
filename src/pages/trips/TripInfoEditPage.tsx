import 'dayjs/locale/ko';
import { css } from '@emotion/react';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { ROUTES } from '@/constants/paths';
import { BUTTON } from '@/constants/ui';
import { useTripInfoForm } from '@/hooks/useTripInfoForm';

const TripInfoEditPage = () => {
    const { tripInfo, setTripInfo, isLoading, isFormComplete, handleTripInfoSubmit, navigateBeforePage } =
        useTripInfoForm('edit');

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer}>
            <Header title={ROUTES.PATH_TITLE.TRIPS.EDIT} isBackButton onBack={navigateBeforePage} />
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
