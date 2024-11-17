import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import UploadingSpinner from '@/components/features/guide/UploadingSpinner';
import TripForm from '@/components/features/trip/TripForm';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { useTripForm } from '@/hooks/useTripForm';

const TripInfoPage = () => {
    const [isFormComplete, setIsFormComplete] = useState(false);

    const { imageDates, tripId, tripInfo, isUploading, setTripInfo, handleSubmit } = useTripForm();

    const navigate = useNavigate();

    useEffect(() => {
        const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;
        if (hashtags.length > 0 && tripTitle && country && startDate && endDate) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    return (
        <div css={pageContainer}>
            <Header
                title={PAGE.NEW_TRIP}
                isBackButton
                onBack={() => navigate(`${PATH.TRIPS.NEW.IMAGES(Number(tripId))}`)}
            />
            <main css={mainStyle}>
                <TripForm imageDates={imageDates} tripInfo={tripInfo} setTripInfo={setTripInfo} />
                <Button text='여행 등록하기' onClick={handleSubmit} disabled={!isFormComplete} />
            </main>
            {isUploading && <UploadingSpinner />}
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

export default TripInfoPage;
