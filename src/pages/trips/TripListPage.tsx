import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { TicketsPlane, PlaneTakeoff } from 'lucide-react';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import { toResult } from '@/api/utils';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import TripTicket from '@/components/features/trip/TripTicket';
import { ROUTES } from '@/constants/paths';
import { BUTTON } from '@/constants/ui/buttons';
import { useTripTicketList } from '@/hooks/queries/useTrip';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { Trip } from '@/types/trip';

const TripListPage = () => {
    const [tripList, setTripList] = useState<Trip[]>([]);
    const showToast = useToastStore((state) => state.showToast);
    const { data: result, isFetching } = useTripTicketList();

    const navigate = useNavigate();

    useEffect(() => {
        if (!result) return;
        if (!result.success) {
            showToast(result?.error as string);
        }

        setTripList(() => (result?.success ? [...result.data].reverse() : []));
    }, [result, showToast]);

    const handleCreateTripButtonClick = async () => {
        const result = await toResult(() => tripAPI.createNewTrip());
        if (result.success) {
            const { tripKey } = result.data;
            navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(tripKey)}`);
        } else {
            showToast(result.error);
        }
    };

    const tripCount = tripList.length;

    return (
        <div css={pageContainer}>
            {isFetching && <Spinner />}
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
                !isFetching && (
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
