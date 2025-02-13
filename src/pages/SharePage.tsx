import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { shareAPI } from '@/api/trips/share';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import { ROUTES } from '@/constants/paths';
import theme from '@/styles/theme';
import { formatDateTime } from '@/utils/date';

interface SharedTrip {
    createdAt: string;
    message: string;
    notificationId: number;
    status: string;
}

interface SendTrip {
    ownerNickname: string;
    shareId: number;
    status: string;
    tripId: number;
    tripTitle: string;
}

const SharePage = () => {
    const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>();
    const [sendTrips, setSendTrips] = useState<SendTrip[]>();
    const [isReceiveOpen, setIsReceiveOpen] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getSharedTrips = async () => {
            const userId = localStorage.getItem('userId') || '';
            const sharedTrips = await shareAPI.getSharedTrip(userId);

            const sendTrips = await shareAPI.getSendTrip(userId);

            console.log(sendTrips);

            setSharedTrips(sharedTrips);
            setSendTrips(sendTrips);
        };

        getSharedTrips();
    }, []);

    console.log(sharedTrips);

    const handleApproveClick = async (shareId: string) => {
        const recipientId = localStorage.getItem('userId') || '';
        await shareAPI.approveSharedTrip(recipientId, shareId, 'APPROVED');
    };

    const handleRejectClick = async (shareId: string) => {
        const recipientId = localStorage.getItem('userId') || '';
        await shareAPI.approveSharedTrip(recipientId, shareId, 'REJECTED');
    };

    const handleReceiveClick = () => {
        setIsReceiveOpen(true);
    };

    const handleSendClick = () => {
        setIsReceiveOpen(false);
    };

    if (!sharedTrips || !sendTrips) return;

    return (
        <div css={pageContainer}>
            <Header title={'여행 공유'} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />

            <div css={tabs}>
                <div css={tab} onClick={handleReceiveClick}>
                    공유 받음
                </div>
                <div css={tab} onClick={handleSendClick}>
                    공유 보냄
                </div>
            </div>

            {isReceiveOpen ? (
                <div css={receive}>
                    {sharedTrips.map((trip: SharedTrip) => (
                        <div key={trip.notificationId} css={tripItem}>
                            <p css={[date, text(null)]}>{formatDateTime(trip.createdAt)}</p>
                            <div css={trips}>
                                <div css={category}>
                                    <p css={label}>제목</p>
                                    <p css={text(null)}>{trip.message}</p>
                                </div>
                                <div css={buttonGroup}>
                                    <Button
                                        text='거절'
                                        variant='white'
                                        onClick={() => handleRejectClick(String(trip.notificationId))}
                                    />
                                    <Button
                                        text='수락'
                                        onClick={() => handleApproveClick(String(trip.notificationId))}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div css={receive}>
                    {sendTrips.map((trip: SendTrip) => (
                        <div key={trip.shareId} css={tripItem}>
                            <div css={trips}>
                                <div css={category}>
                                    <p css={label}>제목</p>
                                    <p css={text(null)}>{trip.tripTitle}</p>
                                </div>
                                <div css={category}>
                                    <p css={label}>보낸 사람</p>
                                    <p css={text(null)}>{trip.ownerNickname}</p>
                                </div>
                                <div css={category}>
                                    <p css={label}>수락 상태</p>
                                    <p css={text(trip.status)}>
                                        {trip.status === 'REJECTED'
                                            ? '거절됨'
                                            : trip.status === 'APPROVED'
                                              ? '승인됨'
                                              : '대기중'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    overflow: auto;
`;

const tabs = css`
    padding: 12px;
    display: flex;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #ccc;
`;

const tab = css`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #ccc;
    border-left: 1px solid #ccc;
    cursor: pointer;
    font-weight: bold;
`;

const receive = css`
    padding: 12px;
`;

const tripItem = css`
    border: 2px solid ${theme.COLORS.PRIMARY};
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const date = css`
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${theme.COLORS.PRIMARY};
`;

const trips = css`
    padding: 14px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 16px;
`;

const category = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
`;

const label = css`
    font-weight: bold;
`;

const text = (status: string | null) => css`
    color: ${status === 'REJECTED' ? theme.COLORS.TEXT.ERROR : status === 'APPROVED' ? 'blue' : 'black'};
    font-weight: 500;
    transition: color 0.2s ease;

    /* 추가적인 텍스트 스타일링 */
    font-size: 14px;
    line-height: 1.5;
`;

const buttonGroup = css`
    width: 160px;
    display: flex;
    gap: 6px;
`;

export default SharePage;
