import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TripInfoForm from '@/domains/trip/components/TripInfoForm';
import { FORM } from '@/domains/trip/constants';
import { useTripInfo } from '@/domains/trip/hooks/queries';
import { useTripInfoForm } from '@/domains/trip/hooks/useTripInfoForm';
import { TripInfo } from '@/domains/trip/types';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripInfoEditPage = () => {
    const [tripInfo, setTripInfo] = useState<TripInfo>(FORM.INITIAL);
    const showToast = useToastStore((state) => state.showToast);

    const { tripKey } = useParams();
    const {
        pathname,
        state: { isDraft },
    } = useLocation();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const isEditing = pathname.includes('edit');

    const { data: tripInfoResult, isLoading } = useTripInfo(tripKey!);
    const { isSubmitting, isFormComplete, submitTripInfo } = useTripInfoForm(isEditing, tripInfo);

    useEffect(() => {
        if (isEditing) {
            if (!tripInfoResult || !tripInfoResult.success) {
                navigate(-1);
                showToast(tripInfoResult?.error as string);
                return;
            }

            queryClient.invalidateQueries({ queryKey: ['ticket-info'] });
            setTripInfo(tripInfoResult.data);
        }

        // setTripInfo(() => ({
        //     ...tripInfo,
        //     mediaFilesDates,
        // }));
    }, [tripInfoResult, isEditing]);

    return (
        <div css={pageContainer}>
            {(isLoading || isSubmitting) && <Indicator text='여행 정보 불러오는 중...' />}

            <Header
                title={ROUTES.PATH_TITLE.TRIPS.NEW.INFO}
                isBackButton={isEditing}
                onBack={() => navigate(ROUTES.PATH.MAIN)}
            />
            <main css={mainStyle}>
                <TripInfoForm isEditing={isEditing} tripInfo={tripInfo} onChangeTripInfo={setTripInfo} />
                <Button
                    text={`여행 ${isEditing ? '수정' : '등록'}하기`}
                    onClick={() => submitTripInfo(tripInfo)}
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
