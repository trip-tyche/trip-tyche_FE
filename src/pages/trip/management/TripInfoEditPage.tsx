import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TripInfoForm from '@/domains/trip/components/TripInfoForm';
import { FORM } from '@/domains/trip/constants';
import { useTripFormSubmit } from '@/domains/trip/hooks/mutations';
import { useTripInfo } from '@/domains/trip/hooks/queries';
import { useTripFormValidation } from '@/domains/trip/hooks/useTripFormValidation';
import { TripInfo } from '@/domains/trip/types';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripInfoEditPage = () => {
    const [tripForm, setTripForm] = useState<TripInfo>(FORM.INITIAL);
    const [isTripFinalizing, setIsTripFinalizing] = useState(false);
    const showToast = useToastStore((state) => state.showToast);

    const { tripKey } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        state: { isDraft },
    } = location;

    const queryClient = useQueryClient();
    const { mutateAsync, isPending: isSubmitting } = useTripFormSubmit();

    const { data: tripInfoResult, isLoading } = useTripInfo(tripKey!);
    const { isFormComplete } = useTripFormValidation(tripForm);

    useEffect(() => {
        if (tripInfoResult) {
            if (!tripInfoResult.success) {
                showToast(tripInfoResult?.error);
                navigate(ROUTES.PATH.MAIN);
                return;
            }
            setTripForm((prev) => {
                if (isDraft) {
                    const mediaFileDates = tripInfoResult.data.mediaFilesDates || [];
                    const validMediaFileDates = mediaFileDates.filter((mediaFile) => mediaFile !== '1980-01-01');
                    return {
                        ...prev,
                        mediaFilesDates: validMediaFileDates,
                    };
                }
                return tripInfoResult.data;
            });
        }
    }, [tripInfoResult, isDraft]);

    const finalizeTrip = async () => {
        if (!tripKey) return;

        const result = await toResult(() => tripAPI.finalizeTripTicket(tripKey));
        if (result && !result.success) {
            showToast(result.error);
        }
    };

    const handleTripFormSubmit = async () => {
        if (!tripKey) return;

        const result = await mutateAsync({ tripKey, tripForm });
        if (result.success) {
            queryClient.invalidateQueries({ queryKey: ['ticket-info', tripKey] });
            if (isDraft) {
                setIsTripFinalizing(true);
                await finalizeTrip();
                setIsTripFinalizing(false);
            }
        }
        showToast(result.success ? result.data : result.error);
        navigate(ROUTES.PATH.MAIN);
    };

    return (
        <div css={pageContainer}>
            {(isLoading || isSubmitting || isTripFinalizing) && <Indicator text='여행 정보 불러오는 중...' />}

            <Header title={ROUTES.PATH_TITLE.TRIPS.NEW.INFO} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <main css={mainStyle}>
                <TripInfoForm isEditing={true} tripForm={tripForm} onChangeTripInfo={setTripForm} />
                <Button
                    text={`여행 ${isDraft ? '등록' : '수정'}하기`}
                    onClick={handleTripFormSubmit}
                    disabled={!isFormComplete}
                />
            </main>
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

export default TripInfoEditPage;
