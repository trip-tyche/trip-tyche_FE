import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/layout/Header';
import UploadingSpinner from '@/components/pages/image-upload/UploadingSpinner';
import TripForm from '@/components/pages/newTrip/TripForm';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useTripForm } from '@/hooks/useTripForm';

const TripInfoPage = () => {
    const [isRequired, setIsRequired] = useState(false);

    const {
        tripId,
        tripTitle,
        country,
        startDate,
        endDate,
        hashtags,
        isUploading,
        setTripTitle,
        setCountry,
        setStartDate,
        setEndDate,
        setHashtags,
        handleSubmit,
    } = useTripForm();

    const navigate = useNavigate();

    const imageDates = JSON.parse(localStorage.getItem('image-date') || '');

    useEffect(() => {
        if (tripTitle && country && startDate && endDate) {
            setIsRequired(true);
        }
    }, [tripTitle, country, startDate, endDate]);

    return (
        <div css={containerStyle}>
            <div>
                <Header
                    title={PAGE.NEW_TRIP}
                    isBackButton
                    onBack={() => navigate(`${PATH.TRIPS.NEW.IMAGES(Number(tripId))}`)}
                />
            </div>
            <main css={mainStyle}>
                <div css={tripFormWrapper}>
                    <TripForm
                        tripTitle={tripTitle}
                        country={country}
                        startDate={startDate}
                        endDate={endDate}
                        imageDates={imageDates}
                        hashtags={hashtags}
                        setTripTitle={setTripTitle}
                        setCountry={setCountry}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setHashtags={setHashtags}
                    />
                </div>
                <Button text='등록하기' onClick={handleSubmit} disabled={!isRequired} />
            </main>
            {isUploading && <UploadingSpinner />}
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

export default TripInfoPage;
