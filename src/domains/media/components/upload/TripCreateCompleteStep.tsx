import { css } from '@emotion/react';
import { Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MovableTripTicket from '@/domains/trip/components/MovableTripTicket';
import { TripInfo } from '@/domains/trip/types';
import AlertBox from '@/shared/components/common/AlertBox';
import Button from '@/shared/components/common/Button';
import { ROUTES } from '@/shared/constants/route';

const TripCreateCompleteStep = ({ tripInfo }: { tripInfo: TripInfo }) => {
    const navigate = useNavigate();

    return (
        <div css={container}>
            <div css={content}>
                <div css={iconWrapper}>
                    <Check size={32} color='#059669' />
                </div>
                <h2 css={title}>여행 등록 완료!</h2>
                <p css={description}>{`새로운 여행이 성공적으로 등록되었습니다.\n아래 티켓을 움직여보세요.`}</p>

                <MovableTripTicket trip={tripInfo} />
            </div>

            <div>
                {true && (
                    <AlertBox
                        theme='warning'
                        title='누락된 정보가 있습니다'
                        description='위치 또는 날짜 정보가 없는 사진이 있습니다. 사진 관리 페이지에서 정보를 추가해 보세요'
                        icon={<AlertCircle size={20} />}
                    />
                )}
                <div css={buttonWrapper}>
                    <Button text='여행 티켓 보러가기' onClick={() => navigate(ROUTES.PATH.MAIN)} />
                </div>
            </div>
        </div>
    );
};

const container = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const content = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const iconWrapper = css`
    margin: 24px 0;
    background-color: #d1fae5;
    padding: 8px;
    border-radius: 9999px;
`;

const title = css`
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
`;

const description = css`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 24px;
    color: #666666;
    text-align: center;
    line-height: 1.3;
    white-space: pre-line;
`;

const buttonWrapper = css`
    width: 100%;
    margin-top: 32px;
`;

export default TripCreateCompleteStep;
