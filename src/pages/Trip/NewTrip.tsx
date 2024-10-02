import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import TripForm from '@/components/pages/newTrip/TripForm';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripForm } from '@/hooks/useTripForm';

const NewTrip = (): JSX.Element => {
    const {
        tripTitle,
        setTripTitle,
        country,
        setCountry,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        hashtags,
        setHashtags,
        handleSubmit,
    } = useTripForm();

    return (
        <div css={containerStyle}>
            <Header title={PAGE.NEW_TRIP} isBackButton />
            <main css={mainStyle}>
                <TripForm
                    tripTitle={tripTitle}
                    setTripTitle={setTripTitle}
                    country={country}
                    setCountry={setCountry}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    hashtags={hashtags}
                    setHashtags={setHashtags}
                />
                <div css={buttonWrapperStyle}>
                    <Button text={BUTTON.NEXT} theme='sec' size='full' onClick={handleSubmit} />
                </div>
            </main>
        </div>
    );
};

const containerStyle = css`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
`;

const buttonWrapperStyle = css``;

export default NewTrip;
