import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Settings, Bell } from 'lucide-react';
import { FaArrowCircleDown } from 'react-icons/fa';
import { GiRapidshareArrow } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import { shareAPI } from '@/api/trips/share';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import IntroTicket from '@/components/features/trip/IntroTicket';
import NickNameForm from '@/components/features/user/NickNameForm';
import { ROUTES } from '@/constants/paths';
import { WELCOME_TICKET_DATA } from '@/constants/trip/form';
import { NICKNAME_FORM } from '@/constants/ui/message';
import useAuthStore from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { TripModel } from '@/types/trip';
import { validateUserAuth } from '@/utils/validation';

interface Notification {
    notificationId: number;
    shareId: number;
    message: string;
    status: string;
    createdAt: string;
}

const MainPage = () => {
    const [latestTrip, setLatestTrip] = useState(null);
    const [tripCount, setTripCount] = useState(0);
    const [isInitializing, setIsInitializing] = useState(true);
    const [sharedTripsCount, setSharedTripsCount] = useState(0);

    const isLogin = useAuthStore((state) => state.isLogIn);
    const userNickName = useUserDataStore((state) => state.userNickName);
    const setLogout = useAuthStore((state) => state.setLogout);
    const setUserNickName = useUserDataStore((state) => state.setUserNickName);
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();

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
                navigate(ROUTES.PATH.AUTH.LOGIN);
                showToast('오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                setIsInitializing(false);
            }
        };
        initializeMainPage();
    }, []);

    const getUserInfoData = async () => {
        const isValidUser = validateUserAuth();

        if (!isValidUser) {
            navigate(ROUTES.PATH.AUTH.LOGIN);
            return;
        }
        const { userNickName, trips } = await tripAPI.fetchTripTicketList();

        const userId = localStorage.getItem('userId') || '';
        const response = await shareAPI.getNotifications(userId);
        const sharedTripsCount = response.data.filter((trip: Notification) => trip.status === 'UNREAD');

        setSharedTripsCount(sharedTripsCount.length);

        const validTripList = trips?.filter((trip: TripModel) => trip.tripTitle !== 'N/A');
        const latestTrip = validTripList[validTripList.length - 1];

        setUserNickName(userNickName);
        setTripCount(validTripList.length);
        setLatestTrip(latestTrip);
    };

    const handleButtonClick = async () => {
        if (latestTrip) {
            navigate(ROUTES.PATH.TRIPS.ROOT);
            return;
        }

        const tripId = await tripAPI.createTrip();
        navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(tripId)}`, { state: 'first-ticket' });
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
                            {!!sharedTripsCount && <div css={count} />}
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
    padding-right: 4px;
`;

const settingIconStyle = css`
    cursor: pointer;
`;

const shareIconStyle = css`
    position: relative;
    cursor: pointer;
`;

const count = css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    top: 1px;
    right: 2px;
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
