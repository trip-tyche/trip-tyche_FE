import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Settings, Bell } from 'lucide-react';
import { FaArrowCircleDown } from 'react-icons/fa';
import { GiRapidshareArrow } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
// import { shareAPI } from '@/api/trips/share';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import IntroTicket from '@/components/features/trip/IntroTicket';
import NickNameForm from '@/components/features/user/NickNameForm';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';
import { WELCOME_TICKET_DATA } from '@/constants/trip/form';
import { NICKNAME_FORM } from '@/constants/ui/message';
// import webSocketService from '@/services/webSocketService';
import webSocketService from '@/services/webSocketService';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { Trip } from '@/types/trip';
import { validateUserAuth } from '@/utils/validation';

const MainPage = () => {
    const [latestTrip, setLatestTrip] = useState<Trip | null>(null);
    const [tripCount, setTripCount] = useState<number>(0);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [sharedTripsCount, setSharedTripsCount] = useState<number>(0);

    const isLogin = useAuthStore((state) => state.isLogIn);
    const userNickName = useUserDataStore((state) => state.userNickName);
    const setLogout = useAuthStore((state) => state.setLogout);
    const setUserNickName = useUserDataStore((state) => state.setUserNickName);
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // connect가 Promise를 반환하지 않는 경우 처리
        // console.log('웹소켓 연결 시도...');
        webSocketService.connect(userId); // Promise가 아니므로 직접 호출

        // 약간의 지연 후 알림 설정 (웹소켓 연결 시간 고려)
        setTimeout(() => {
            if (webSocketService.isConnected()) {
                console.log('알림 설정 시작...');

                // 콜백 등록
                webSocketService.setUnreadCountCallback((count) => {
                    console.log('콜백 호출됨, 카운트:', count);
                    setSharedTripsCount(count);
                });

                // 요청 보내기
                console.log('알림 카운트 요청 보냄...');
                webSocketService.requestNotificationCount(userId);
            } else {
                console.log('웹소켓 연결 실패 또는 진행 중...');
            }
        }, 200); // 1초 지연

        return () => {
            webSocketService.setUnreadCountCallback(() => null);
        };
    }, []);

    useEffect(() => {
        if (!isLogin) {
            setLogout();
            navigate(ROUTES.PATH.AUTH.LOGIN);
            return;
        }

        const initializeMainPage = async () => {
            try {
                await getUserInfoData();
            } catch (error) {
                console.log('컴포넌트 catch!', error);
                navigate(ROUTES.PATH.AUTH.LOGIN);
                // showToast('오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                setIsInitializing(false);
            }
        };
        initializeMainPage();
    }, [isLogin, navigate, setLogout, showToast]);

    // 알림 목록 불러오는 함수
    // const fetchNotifications = async (): Promise<void> => {
    //     try {
    //         const userId = localStorage.getItem('userId') || '';
    //         const response = await shareAPI.getNotifications(userId);
    //         const sharedTripsCount = response.data.filter((trip: Notification) => trip.status === 'UNREAD');
    //         setSharedTripsCount(sharedTripsCount.length);
    //     } catch (error) {
    //         console.error('알림 가져오기 오류:', error);
    //     }
    // };

    const getUserInfoData = async (): Promise<void> => {
        const isValidUser = validateUserAuth();

        if (!isValidUser) {
            navigate(ROUTES.PATH.AUTH.LOGIN);
            return;
        }

        const result = await tripAPI.fetchTripTicketList();

        const trips = result.data;

        // 알림 목록 불러오기
        // await fetchNotifications();
        const validTripList = trips?.filter((trip: Trip) => trip.tripTitle !== 'N/A') as Trip[];
        const latestTrip = validTripList[validTripList.length - 1];

        // setUserNickName(userNickName);
        setTripCount(validTripList.length);
        setLatestTrip(latestTrip);
    };

    const handleButtonClick = async (): Promise<void> => {
        if (latestTrip) {
            navigate(ROUTES.PATH.TRIPS.ROOT);
            return;
        }

        try {
            const result = await tripAPI.createTripTicket();
            if (!result.isSuccess) throw new Error(result.error);

            const tripId = result.data;
            if (tripId) {
                navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(tripId)}`, { state: 'first-ticket' });
            }
        } catch (error) {
            console.error(error);
            showToast('잠시 후 다시 시도해주세요.');
        }
    };

    if (isInitializing) {
        return <Spinner />;
    }

    return (
        <>
            {!userNickName ? (
                <main css={nickNameFormContainer}>
                    <Header title='닉네임 등록' />
                    <NickNameForm
                        mode='create'
                        title={`반가워요! ${NICKNAME_FORM.TITLE}`}
                        buttonText='등록 완료'
                        getUserInfoData={getUserInfoData}
                    />
                </main>
            ) : (
                <main css={pageContainer}>
                    <div css={headerStyle}>
                        <div css={shareIconStyle}>
                            {!!sharedTripsCount && <div css={count}>{sharedTripsCount}</div>}
                            <Bell css={settingIconStyle} onClick={() => navigate(ROUTES.PATH.SHARE)} />
                        </div>
                        <Settings css={settingIconStyle} onClick={() => navigate(ROUTES.PATH.SETTING)} />
                    </div>
                    <div css={ticketContainerStyle}>
                        <p css={dragGuideStyle}>
                            <GiRapidshareArrow />
                            아래 티켓을 움직여보세요!
                        </p>
                        <IntroTicket trip={latestTrip || WELCOME_TICKET_DATA} userNickname={userNickName} />
                    </div>
                    {tripCount ? (
                        <p css={ticketGuideStyle}>
                            지금까지 <span css={tripCountStyle}>{tripCount}</span>장의 여행 티켓을 만들었어요!
                        </p>
                    ) : (
                        <p css={ticketGuideStyle}>
                            <FaArrowCircleDown />
                            아래 버튼을 눌러서 새로운 여행을 등록해주세요
                        </p>
                    )}
                    <div css={buttonWrapper}>
                        <Button
                            text={latestTrip ? '여행 티켓 보러가기' : '새로운 여행 등록하기'}
                            onClick={handleButtonClick}
                        />
                    </div>
                </main>
            )}
        </>
    );
};

const nickNameFormContainer = css`
    display: flex;
    flex-direction: column;
    height: 100dvh;
`;

const pageContainer = css`
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding: 16px;
`;

const headerStyle = css`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const settingIconStyle = css`
    margin-right: 4px;
    cursor: pointer;
`;

const shareIconStyle = css`
    position: relative;
    cursor: pointer;
`;

const count = css`
    width: 12px;
    height: 12px;
    background-color: ${COLORS.TEXT.ERROR};
    position: absolute;
    top: -2px;
    right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 10px;
    font-weight: bold;
    color: white;
`;

const ticketContainerStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const dragGuideStyle = css`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: ${theme.FONT_SIZES.SM};
    color: ${theme.COLORS.TEXT.DESCRIPTION};
    font-weight: bold;
    margin-bottom: 24px;
`;

const ticketGuideStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-size: ${theme.FONT_SIZES.MD};
    font-weight: bold;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
`;

const tripCountStyle = css`
    font-size: ${theme.FONT_SIZES.XL};
    color: ${theme.COLORS.PRIMARY};
`;

const buttonWrapper = css`
    padding: 0 4px;
    margin: 24px 0 12px 0;
`;

export default MainPage;
