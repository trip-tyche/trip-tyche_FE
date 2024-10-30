import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import axios from 'axios';
import { TicketsPlane } from 'lucide-react';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { getTripList } from '@/api/trip';
import Button from '@/components/common/button/Button';
import Loading from '@/components/common/Loading';
import Toast from '@/components/common/Toast';
import Header from '@/components/layout/Header';
import BorderPass from '@/components/pages/trip-list/BorderPass';
import { ENV } from '@/constants/auth';
import { TRIP } from '@/constants/message';
import { PATH } from '@/constants/path';
import { BUTTON, PAGE } from '@/constants/title';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { Trip } from '@/types/trip';
import { getToken } from '@/utils/auth';
import { formatTripDate } from '@/utils/date';

const TripList = (): JSX.Element => {
    const [userNickname, setUserNickname] = useState<string>('');
    const [tripList, setTripList] = useState<Trip[]>([]);
    const [tripCount, setTripCount] = useState(0);
    const [isDelete, setIsDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToastStore();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTripList = async () => {
            try {
                setIsLoading(true);
                const tripList = await getTripList();

                console.log(tripList);

                if (typeof tripList !== 'object') {
                    showToast('일시적인 서버 문제로 로그아웃 되었습니다.');
                    navigate(PATH.LOGIN);
                    localStorage.clear();
                    return;
                }

                setUserNickname(tripList.userNickName);
                setTripList(tripList.trips);
                setTripCount(tripList.trips?.length);
                setIsDelete(false);
            } catch (error) {
                console.error('Error fetching trip-list data:', error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        localStorage.removeItem('tripId');
        localStorage.removeItem('tripTitle');

        fetchTripList();
    }, [isDelete, showToast, navigate]);

    if (isLoading) {
        <Loading />;
    }

    const handleTicketCreate = async () => {
        // try {
        //     const token = getToken();
        //     const response = await axios.post(`${ENV.BASE_URL}/api/trips`, {
        //         headers: {
        //             accept: '*/*',
        //             Authorization: `Bearer ${token}`,
        //         },
        //     });
        //     console.log(response.data);
        // } catch (error) {
        //     console.error('Error fetching trip data:', error);
        // }

        navigate(PATH.TRIP_NEW);
    };

    return (
        <div css={containerStyle}>
            <Header title={PAGE.TRIP_LIST} isBackButton onBack={() => navigate(PATH.HOME)} />
            {isLoading ? (
                <div css={loadingWrapper}>
                    <Loading />
                </div>
            ) : (
                <>
                    <div css={addTripStyle}>
                        {tripCount === 0 ? (
                            <div css={countStyle}>아직 만든 티켓이 없어요!</div>
                        ) : (
                            <div css={countStyle}>
                                <TicketsPlane size={20} /> <span>{tripCount}</span> 개의 티켓을 만들었어요!
                            </div>
                        )}

                        <div>
                            <Button text={BUTTON.NEW_TRIP} btnTheme='pri' size='sm' onClick={handleTicketCreate}>
                                <Button.Left>
                                    <LuPlus size={16} />
                                </Button.Left>
                            </Button>
                        </div>
                    </div>
                    {tripCount > 0 ? (
                        <div css={tripListStyle}>
                            {formatTripDate(tripList)?.map((trip) => (
                                <BorderPass
                                    key={trip.tripId}
                                    trip={trip}
                                    userNickname={userNickname}
                                    setTripCount={setTripCount}
                                    setIsDelete={setIsDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <p css={noTripListStyle}>{TRIP.NO_TRIP}</p>
                    )}
                </>
            )}
            <Toast />
        </div>
    );
};

const containerStyle = css`
    position: relative;
    height: 100dvh;
`;

const loadingWrapper = css`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const addTripStyle = css`
    display: flex;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 8px;
    height: 54px;
`;

const countStyle = css`
    margin-left: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.black};

    span {
        font-size: 18px;
        font-weight: 600;
        color: ${theme.colors.primary};
        margin: 0 2px 0 8px;
    }
`;

const tripListStyle = css`
    display: flex;
    flex-direction: column;
    margin: 0 8px;
    padding-bottom: 10px;
`;

const noTripListStyle = css`
    height: calc(100dvh - 108px);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default TripList;
