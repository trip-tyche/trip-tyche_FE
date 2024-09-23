import { css } from '@emotion/react';

import Button from '@/components/common/Button/Button';
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
        <div>
            <Header title={PAGE.NEW_TRIP} isBackButton />
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
                <Button text={BUTTON.NEXT} theme='sec' size='sm' onClick={handleSubmit} />
            </div>
        </div>
    );
};

const buttonWrapperStyle = css`
    padding: 20px;
    display: flex;
    justify-content: end;
`;

export default NewTrip;
