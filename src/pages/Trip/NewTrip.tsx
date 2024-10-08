import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import Demo from '@/components/Demo';
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
                    <Button text={BUTTON.NEXT} btnTheme='pri' size='lg' onClick={handleSubmit} />
                </div>
            </main>
            {/* <Demo /> */}
        </div>
    );
};

const containerStyle = css`
    /* height: 100vh; */
`;

const mainStyle = css`
    height: calc(100vh - 44px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
`;

const buttonWrapperStyle = css``;

export default NewTrip;
