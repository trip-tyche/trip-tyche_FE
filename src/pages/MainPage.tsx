import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Settings } from 'lucide-react';
import { FaArrowCircleDown } from 'react-icons/fa';
import { MdWavingHand } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import IntroTicket from '@/components/features/trip/IntroTicket';
import NickNameForm from '@/components/features/user/NickNameForm';
import { PATH } from '@/constants/path';
import { WELCOME_TICKET_DATA } from '@/constants/trip';
import useAuthStore from '@/stores/useAuthStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { Trip } from '@/types/trip';
import { validateUserAuth } from '@/utils/validation';

const MainPage = () => {
    const [latestTrip, setLatestTrip] = useState(null);
    const [tripCount, setTripCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const isLogin = useAuthStore((state) => state.isLogIn);
    const userNickName = useUserDataStore((state) => state.userNickName);
    const setLogout = useAuthStore((state) => state.setLogout);
    const setUserNickName = useUserDataStore((state) => state.setUserNickName);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            setLogout();
            navigate(PATH.AUTH.LOGIN);
            return;
        }
        getUserInfoData();
    }, []);

    const getUserInfoData = async () => {
        const isValidUser = validateUserAuth();

        if (!isValidUser) {
            navigate(PATH.AUTH.LOGIN);
            return;
        }

        setIsLoading(true);
        const { userNickName, trips } = await tripAPI.fetchTripTicketList();
        setIsLoading(false);

        const validTripList = trips?.filter((trip: Trip) => trip.tripTitle !== 'N/A');
        const latestTrip = validTripList[validTripList.length - 1];

        setUserNickName(userNickName);
        setTripCount(validTripList.length);
        setLatestTrip(latestTrip);
    };

    const handleButtonClick = async () => {
        if (latestTrip) {
            navigate(PATH.TRIPS.ROOT);
            return;
        }

        const tripId = await tripAPI.createTrip();
        navigate(`${PATH.TRIPS.NEW.IMAGES(tripId)}`, { state: 'first-ticket' });
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            {!userNickName ? (
                <main css={nickNameFormContainer}>
                    <Header title='닉네임 등록' />
                    <NickNameForm
                        mode='create'
                        title='반가워요! 새로운 닉네임을 등록해주세요. 😀'
                        buttonText='등록 완료'
                        getUserInfoData={getUserInfoData}
                    />
                </main>
            ) : (
                <main css={pageContainer}>
                    <div css={headerStyle}>
                        <Settings css={settingIconStyle} onClick={() => navigate(PATH.SETTING)} />
                    </div>
                    <div css={ticketContainerStyle}>
                        <p css={dragGuideStyle}>
                            <MdWavingHand />
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
    justify-content: flex-end;
    padding-right: 4px;
`;

const settingIconStyle = css`
    cursor: pointer;
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
    font-size: ${theme.fontSizes.small_12};
    color: ${theme.colors.descriptionText};
    font-weight: bold;
    margin-bottom: 24px;
`;

const ticketGuideStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-size: ${theme.fontSizes.normal_14};
    font-weight: bold;
    color: ${theme.colors.descriptionText};
`;

const tripCountStyle = css`
    font-size: ${theme.fontSizes.xlarge_18};
    color: ${theme.colors.primary};
`;

const buttonWrapper = css`
    padding: 0 4px;
    margin: 24px 0 12px 0;
`;

const loadingSpinnerStyle = css`
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default MainPage;
