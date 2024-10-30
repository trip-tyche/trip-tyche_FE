import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import GuideModal from '@/components/common/modal/GuideModal';
import Header from '@/components/layout/Header';
import TripForm from '@/components/pages/newTrip/TripForm';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import { useTripForm } from '@/hooks/useTripForm';
import theme from '@/styles/theme';
import { formatDateToKoreanYear } from '@/utils/date';

const NewTrip = () => {
    const [isRequired, setIsRequired] = useState(false);
    const [isOpenGuideModal, setIsOpenGuideModal] = useState(true);

    const {
        tripTitle,
        country,
        startDate,
        endDate,
        hashtags,
        setTripTitle,
        setCountry,
        setStartDate,
        setEndDate,
        setHashtags,
        handleSubmit,
    } = useTripForm();

    const navigate = useNavigate();

    const earliestDate = localStorage.getItem('earliest-date');
    const latestDate = localStorage.getItem('latest-date');

    useEffect(() => {
        if (tripTitle && country && startDate && endDate) {
            setIsRequired(true);
        }
    }, [tripTitle, country, startDate, endDate]);

    const confirmGuideModal = () => {
        setIsOpenGuideModal(false);
    };

    if (!earliestDate || !latestDate) {
        return;
    }

    return (
        <div css={containerStyle}>
            <div>
                <Header title={PAGE.NEW_TRIP} isBackButton onBack={() => navigate(PATH.TRIP_UPLOAD)} />
            </div>
            <main css={mainStyle}>
                <div css={tripFormWrapper}>
                    <TripForm
                        tripTitle={tripTitle}
                        country={country}
                        startDate={startDate}
                        endDate={endDate}
                        hashtags={hashtags}
                        setTripTitle={setTripTitle}
                        setCountry={setCountry}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setHashtags={setHashtags}
                    />
                </div>
                <Button text={BUTTON.NEXT} btnTheme='pri' size='lg' onClick={handleSubmit} disabled={!isRequired} />
            </main>
            {isOpenGuideModal && (
                <GuideModal
                    confirmText='맞습니다'
                    cancelText='아닙니다'
                    confirmModal={confirmGuideModal}
                    closeModal={() => {
                        setIsOpenGuideModal(false);
                    }}
                    isOverlay
                >
                    <div css={dateModalStyle}>
                        <h1>시작일: {formatDateToKoreanYear(earliestDate)}</h1>
                        <h1>종료일: {formatDateToKoreanYear(latestDate)}</h1>위 정보가 맞나요?
                    </div>
                </GuideModal>
            )}
        </div>
    );
};

const dateModalStyle = css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
    margin: 20px 0;

    h1 {
        font-size: 16px;
        font-weight: 600;
        color: ${theme.colors.black};
    }
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

export default NewTrip;
