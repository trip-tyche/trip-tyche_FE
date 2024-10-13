import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import TripForm from '@/components/pages/newTrip/TripForm';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripForm } from '@/hooks/useTripForm';

const NewTrip = () => {
    const [isRequired, setIsRequired] = useState(false);
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

    const navigate = useNavigate();

    useEffect(() => {
        if (tripTitle && country && startDate && endDate) {
            setIsRequired(true);
        }
    }, [tripTitle, country, startDate, endDate]);

    return (
        <div css={containerStyle}>
            <Header title={PAGE.NEW_TRIP} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
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
                    <Button text={BUTTON.NEXT} btnTheme='pri' size='lg' onClick={handleSubmit} disabled={!isRequired} />
                </div>
            </main>
        </div>
    );
};

const containerStyle = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
`;

const buttonWrapperStyle = css`
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 20px;
    padding: 20px;
`;

export default NewTrip;
