import { css } from '@emotion/react';

import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import Header from '@/components/layout/Header';
import TripEditForm from '@/components/pages/tripEdit/TripEditForm';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripEditForm } from '@/hooks/useTripEditForm';

const TripInfoEditPage = () => {
    const { tripData, isLoading, handleInputChange, handleHashtagToggle, handleUpdateTripInfo } = useTripEditForm();

    if (isLoading)
        return (
            <div css={loadingStyle}>
                <Loading />
            </div>
        );

    return (
        <div css={containerStyle}>
            <div>
                <Header title={PAGE.TRIP_EDIT} isBackButton />
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

const loadingStyle = css`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

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
