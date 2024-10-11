import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import Loading from '@/components/common/Loading';
import Header from '@/components/layout/Header';
import TripEditForm from '@/components/pages/tripEdit/TripEditForm';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripEditForm } from '@/hooks/useTripEditForm';

const TripEdit = (): JSX.Element => {
    const { tripData, isLoading, handleInputChange, handleHashtagToggle, handleUpdateTripInfo } = useTripEditForm();

    if (isLoading) return <Loading />;

    return (
        <div css={containerStyle}>
            <Header title={PAGE.TRIP_EDIT} isBackButton />

            <TripEditForm
                tripData={tripData}
                handleInputChange={handleInputChange}
                handleHashtagToggle={handleHashtagToggle}
            />

            <div css={submitButtonStyle}>
                <Button text={BUTTON.UPDATE_TRIP} btnTheme='pri' size='sm' onClick={handleUpdateTripInfo} />
            </div>
        </div>
    );
};

const containerStyle = css`
    min-height: 100dvh;
`;

const submitButtonStyle = css`
    color: white;
    margin-top: 60px;
    display: flex;
    padding: 20px;
    justify-content: end;
`;

export default TripEdit;
