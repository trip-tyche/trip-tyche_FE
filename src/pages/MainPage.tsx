import { css } from '@emotion/react';
import { Settings, Bell } from 'lucide-react';
import { FaArrowCircleDown } from 'react-icons/fa';
import { GiRapidshareArrow } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import Button from '@/components/common/Button';
import IntroTicket from '@/components/features/trip/IntroTicket';
import NickNameForm from '@/components/features/user/NickNameForm';
import { ROUTES } from '@/constants/paths';
// import { COLORS } from '@/constants/theme';
import { WELCOME_TICKET_DATA } from '@/constants/trip/form';
import { NICKNAME_FORM } from '@/constants/ui/message';
// import webSocketService from '@/services/webSocketService';
import { useToastStore } from '@/stores/useToastStore';
import useUserStore from '@/stores/useUserStore';
import theme from '@/styles/theme';

const MainPage = () => {
    // const [notificationCount, setNotificationCount] = useState(0);

    const showToast = useToastStore((state) => state.showToast);
    const { userInfo } = useUserStore();

    console.log(userInfo);

    const navigate = useNavigate();

    // useEffect(() => {
    //     getUserInfo();
    // }, []);

    // useEffect(() => {
    //     // connect가 Promise를 반환하지 않는 경우 처리
    //     // console.log('웹소켓 연결 시도...');
    //     webSocketService.connect(String(userInfo.userId)); // Promise가 아니므로 직접 호출

    //     // 약간의 지연 후 알림 설정 (웹소켓 연결 시간 고려)
    //     setTimeout(() => {
    //         if (webSocketService.isConnected()) {
    //             // console.log('알림 설정 시작...');

    //             // 콜백 등록
    //             webSocketService.setUnreadCountCallback((count) => {
    //                 // console.log('콜백 호출됨, 카운트:', count);
    //                 setNotificationCount(count);
    //             });

    //             // 요청 보내기
    //             // console.log('알림 카운트 요청 보냄...');
    //             webSocketService.requestNotificationCount(String(userInfo.userId));
    //         } else {
    //             // console.log('웹소켓 연결 실패 또는 진행 중...');
    //         }
    //     }, 200); // 1초 지연

    //     return () => {
    //         webSocketService.setUnreadCountCallback(() => null);
    //     };
    // }, [userInfo]);

    // const getUserInfo = async () => {
    //     const result = await userAPI.fetchUserInfo();

    //     const { nickname, userId, tripsCount, recentTrip } = result.data || {};
    //     setUserInfo({ nickname, userId, tripsCount, recentTrip });
    //     setIsInitializing(false);
    // };

    const handleBottomButtonClick = async (): Promise<void> => {
        if (userInfo?.recentTrip) {
            navigate(ROUTES.PATH.TRIPS.ROOT);
            return;
        }

        try {
            const result = await tripAPI.createTripTicket();
            if (!result.success) throw new Error(result.error);

            const tripId = result.data;
            if (tripId) {
                navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(tripId)}`, { state: 'first-ticket' });
            }
        } catch (error) {
            console.error(error);
            showToast('잠시 후 다시 시도해주세요.');
        }
    };

    return (
        <>
            {!userInfo?.nickname ? (
                <NickNameForm
                    mode='create'
                    title={`반가워요! ${NICKNAME_FORM.TITLE}`}
                    buttonText='등록 완료'
                    // getUserInfoData={getUserInfoData}
                />
            ) : (
                <main css={pageContainer}>
                    <div css={headerStyle}>
                        <div css={shareIconStyle}>
                            {/* {!!notificationCount && <div css={count}>{notificationCount}</div>} */}
                            <Bell
                                css={settingIconStyle}
                                onClick={() => navigate(ROUTES.PATH.NOTIFICATION(userInfo.userId))}
                            />
                        </div>
                        <Settings css={settingIconStyle} onClick={() => navigate(ROUTES.PATH.SETTING)} />
                    </div>
                    <div css={ticketContainerStyle}>
                        <p css={dragGuideStyle}>
                            <GiRapidshareArrow />
                            아래 티켓을 움직여보세요!
                        </p>
                        <IntroTicket
                            trip={userInfo?.recentTrip || WELCOME_TICKET_DATA}
                            userNickname={userInfo.nickname}
                        />
                    </div>
                    {userInfo?.tripsCount ? (
                        <p css={ticketGuideStyle}>
                            {/* TODO: tripCount에 잘못된 title 제외되지 않음 */}
                            지금까지 <span css={tripCountStyle}>
                                {userInfo.tripsCount}
                            </span>장의 여행 티켓을 만들었어요!
                        </p>
                    ) : (
                        <p css={ticketGuideStyle}>
                            <FaArrowCircleDown />
                            아래 버튼을 눌러서 새로운 여행을 등록해주세요
                        </p>
                    )}
                    <div css={buttonWrapper}>
                        <Button
                            text={userInfo?.tripsCount ? '여행 티켓 보러가기' : '새로운 여행 등록하기'}
                            onClick={handleBottomButtonClick}
                        />
                    </div>
                </main>
            )}
        </>
    );
};

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

// const count = css`
//     width: 12px;
//     height: 12px;
//     background-color: ${COLORS.TEXT.ERROR};
//     position: absolute;
//     top: -2px;
//     right: 4px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 50%;
//     font-size: 10px;
//     font-weight: bold;
//     color: white;
// `;

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
