import { css } from '@emotion/react';
import { TicketsPlane, PlaneTakeoff } from 'lucide-react';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import TripTicket from '@/domains/trip/components/TripTicket';
import { useTripTicketList } from '@/domains/trip/hooks/queries';
import { Trip } from '@/domains/trip/types';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import Spinner from '@/shared/components/common/Spinner';
import { ROUTES } from '@/shared/constants/paths';
import { BUTTON, MESSAGE } from '@/shared/constants/ui';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';

const TripListPage = () => {
    const showToast = useToastStore((state) => state.showToast);
    const { data: result, isLoading } = useTripTicketList();

    const navigate = useNavigate();

    const handleCreateTripButtonClick = async () => {
        const result = await toResult(() => tripAPI.createNewTrip());
        if (result.success) {
            const { tripKey } = result.data;
            navigate(`${ROUTES.PATH.TRIP.MANAGEMENT.UPLOAD(tripKey!)}`);
        } else {
            showToast(result.error);
        }
    };

    const tripList = result && result?.success ? [...result.data].reverse() : [];
    const tripCount = tripList.length;

    if (result && !result?.success) {
        showToast(result ? result?.error : MESSAGE.ERROR.UNKNOWN);
    }

    return (
        <div css={pageContainer}>
            {isLoading && <Spinner />}
            <Header title='나의 여행 티켓' isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <div css={listHeaderStyle}>
                <div css={listSummaryStyle}>
                    <TicketsPlane size={20} />
                    {tripCount ? (
                        <p>
                            <span css={listCountStyle}>{tripCount}</span> 장의 티켓을 만들었어요!
                        </p>
                    ) : (
                        <p>아직 만든 티켓이 없어요!</p>
                    )}
                </div>
                <Button
                    text={BUTTON.NEW_TRIP}
                    onClick={handleCreateTripButtonClick}
                    icon={<LuPlus size={16} />}
                    css={css`
                        width: auto;
                        height: 34px;
                        padding: 0 12px;
                        border-radius: 8px;
                        font-size: ${theme.FONT_SIZES.SM};
                    `}
                />
            </div>
            <p css={guideStyle}>* 티켓을 클릭하시면 해당 여행의 타임라인으로 이동합니다.</p>
            {tripCount > 0 ? (
                <div css={tripListStyle}>
                    {tripList.map((trip: Trip) => (
                        <TripTicket key={trip.tripKey} tripInfo={trip} />
                    ))}
                </div>
            ) : (
                !isLoading && (
                    <div css={emptyTripListStyle}>
                        <PlaneTakeoff size={24} />
                        <p>등록된 여행이 아직 없습니다.</p>
                    </div>
                )
            )}
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    overflow: auto;
`;

const listHeaderStyle = css`
    display: flex;
    justify-content: space-between;
    padding: 12px 12px 0 12px;
`;

const listSummaryStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
    font-size: ${theme.FONT_SIZES.MD};
    font-weight: bold;
    color: ${theme.COLORS.TEXT.BLACK};
`;

const listCountStyle = css`
    font-size: ${theme.FONT_SIZES.XL};
    font-weight: bold;
    color: ${theme.COLORS.PRIMARY};
`;

const guideStyle = css`
    font-size: ${theme.FONT_SIZES.SM};
    color: ${theme.COLORS.TEXT.DESCRIPTION};
    padding: 24px 12px 8px 16px;
    margin-bottom: 12px;
`;

const tripListStyle = css`
    display: flex;
    flex-direction: column;
    margin: 0 12px;
`;

const emptyTripListStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    height: calc(100dvh - 180px);
    font-size: ${theme.FONT_SIZES.MD};
    font-weight: bold;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
`;

export default TripListPage;
