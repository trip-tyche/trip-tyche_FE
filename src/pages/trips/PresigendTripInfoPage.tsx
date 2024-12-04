import { css } from '@emotion/react';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import UploadingSpinner from '@/components/features/guide/UploadingSpinner';
import TripInfoForm from '@/components/features/trip/TripInfoForm';
import { ROUTES } from '@/constants/paths';
import { useTripInfoForm } from '@/hooks/useTripInfoForm';

const PresigendTripInfoPage = () => {
    const { tripInfo, setTripInfo, isUploading, isFormComplete, handleTripInfoSubmit, navigateBeforePage } =
        useTripInfoForm('create');

    return (
        <div css={pageContainer}>
            <Header title={ROUTES.PATH_TITLE.TRIPS.NEW.INFO} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <TripInfoForm mode='create' tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text='여행 등록하기' onClick={handleTripInfoSubmit} disabled={!isFormComplete} />
            </main>
            {/* {isUploading && <UploadingSpinner />} */}
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

export default PresigendTripInfoPage;
