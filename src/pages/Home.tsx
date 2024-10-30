import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getUserData, postUserNickName } from '@/api/user';

import mainImage from '/public/ogami_1.png';

// import GuideModal from '@/components/common/modal/GuideModal';
import InputModal from '@/components/common/modal/InputModal';
import Card from '@/components/pages/home/Card';
// import Guide from '@/components/pages/home/Guide';
import { NICKNAME_MODAL } from '@/constants/message';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';
import { Trip } from '@/types/trip';
import { getToken, getUserId } from '@/utils/auth';

const Home = () => {
    const [userNickName, setUserNickName] = useState<string>('TripTyche');
    const [userTrips, setUserTrips] = useState<Trip[]>();
    const [inputValue, setInputValue] = useState('');
    const [isOpenInputModal, setIsOpenInputModal] = useState(false);
    // const [isOpenGuideModal, setIsOpenGuideModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const token = getToken();
        const userId = getUserId();
        if (!token || !userId) {
            navigate(PATH.LOGIN);
            return;
        }

        try {
            const { userNickName, trips } = await getUserData(userId);
            console.log(userNickName, trips);
            if (!userNickName) {
                setIsOpenInputModal(true);
            } else {
                localStorage.setItem('userNickName', userNickName);
                setUserNickName(userNickName);
                setUserTrips(trips);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const submitUserNickName = async () => {
        try {
            await postUserNickName(inputValue);
            fetchUserData();
            setIsOpenInputModal(false);
            // setIsOpenGuideModal(true);
        } catch (error) {
            console.error('Error post user-nickname:', error);
        }
    };

    // const confirmGuideModal = () => {
    //     navigate(PATH.TRIP_LIST);
    //     setIsOpenGuideModal(false);
    // };

    return (
        <div css={containerStyle}>
            <div css={headerStyle}>
                <User css={userIconStyle} onClick={() => navigate(PATH.MYPAGE)} />
            </div>
            <div css={cardWrapperStyle}>
                <Card trips={userTrips} />
            </div>
            <div css={contentStyle}>
                <div css={userStyle}>
                    <img css={imageStyle} src={mainImage} alt='main-image' />
                    <p css={subtitleStyle}>
                        안녕하세요, <span css={spanStyle}>{userNickName}</span> 님
                    </p>
                </div>
            </div>
            <div css={borderPassCardStyle} onClick={() => navigate(PATH.TRIP_LIST)}>
                <h2>보더 패스</h2>
                <p>여행 기록 시작하기</p>
            </div>

            {isOpenInputModal && (
                <InputModal
                    title={NICKNAME_MODAL.TITLE}
                    infoMessage={NICKNAME_MODAL.INFO_MESSAGE}
                    placeholder={NICKNAME_MODAL.PLACEHOLDER}
                    submitModal={submitUserNickName}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )}
            {/* {isOpenGuideModal && (
                <GuideModal
                    confirmText='등록하러 가기'
                    cancelText='나중에'
                    confirmModal={confirmGuideModal}
                    closeModal={() => {
                        setIsOpenGuideModal(false);
                    }}
                    isOverlay
                >
                    <Guide nickname={userNickName} />
                </GuideModal>
            )} */}
        </div>
    );
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding: 20px;
`;

const headerStyle = css`
    display: flex;
    justify-content: flex-end;
    padding: 10px;
`;

const userIconStyle = css`
    cursor: pointer;
    width: 24px;
    height: 24px;
`;

const contentStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const userStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
`;

const cardWrapperStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 36px;
`;

const imageStyle = css`
    width: 70px;
    height: auto;
    border-radius: 12px;
`;

const spanStyle = css`
    font-size: ${theme.fontSizes.xxlarge_20};
    font-weight: 600;
    color: ${theme.colors.black};
`;

const subtitleStyle = css`
    font-size: ${theme.fontSizes.large_16};
    color: ${theme.colors.descriptionText};
`;

const borderPassCardStyle = css`
    background-color: ${theme.colors.primary};
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 36px;

    h2 {
        font-size: ${theme.fontSizes.xxlarge_20};
        margin-bottom: 10px;
    }

    p {
        font-size: ${theme.fontSizes.large_16};
    }
`;

export default Home;
