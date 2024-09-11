import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchUserInfo, postUserNickName } from '@/api/user';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import SingleInputModal from '@/components/common/Modal/SingleInputModal';
import OverLay from '@/components/common/OverLay';
import FightHeader from '@/components/layout/AirplaneHeader';
import useAuthStore from '@/stores/useAuthStore';

interface Trip {
    tripId: number;
    country: string;
}

interface PinPoint {
    tripId: number;
    pinPointId: number;
    latitude: number;
    longitude: number;
}

const Home = () => {
    const navigate = useNavigate();
    const [_, setIsOpenModal] = useState<boolean>(false);
    const [userNickName, setUserNickName] = useState<string>('');
    const [trips, setTrips] = useState<Trip[]>();
    const [tripFlags, setTripFlags] = useState<string[]>();
    const [pinPoints, setPinPoints] = useState<PinPoint[]>();
    const [isFirstUser, setIsFirstUser] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const location = useLocation();
    const setLogin = useAuthStore((state) => state.setLogin);

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     const userId = params.get('userId');
    //     const token = params.get('token');

    //     if (userId && token) {
    //         // 로그인 정보 저장
    //         setLogin(userId, token);
    //         console.log('Login success');
    //         // 홈페이지로 리다이렉트
    //         navigate('/', { replace: true });
    //     } else {
    //         console.error('Login failed: Missing userId or token');
    //         navigate('/login', { replace: true });
    //     }
    // }, [location, setLogin, navigate]);

    useEffect(() => {
        const initializeUserData = async () => {
            const { userNickName, trips, pinPoints } = await fetchUserInfo();
            if (!userNickName) {
                // 첫 사용자의 경우
                setIsFirstUser(true);
                console.log('처음이네~');
                return;
            }

            const tripFlags = trips?.map((trip) => trip.country.slice(0, 4));
            setUserNickName(userNickName);
            setTripFlags(tripFlags);
            setTrips(trips);
            setPinPoints(pinPoints);
        };

        initializeUserData();
    }, []);

    const closeModal = () => {
        setIsOpenModal(false);
        setIsFirstUser(false);
    };

    const submitUserNickName = () => {
        postUserNickName(inputValue);
        setUserNickName(inputValue);
        setInputValue('');
        closeModal();
    };

    return (
        <div css={containerStyle}>
            <main css={mainContentStyle}>
                <FightHeader />
                <div css={cardContainerStyle}>
                    <Card trips={trips?.length} tripFlags={tripFlags} />
                </div>

                <LogoImages />

                <p css={description}> {userNickName} 님의 여행을 기억해주세요 😀</p>
            </main>

            {isFirstUser && (
                <>
                    <OverLay closeModal={closeModal} />
                    <SingleInputModal
                        titleText='당신의 이름을 알려주세요'
                        descriptionText='한국어, 영어, 숫자 등 최소 4자리를 입력해주세요.'
                        exampleText='(예. 동남아킬러24)'
                        submitModal={submitUserNickName}
                        setInputValue={setInputValue}
                        value={inputValue}
                    />
                </>
            )}
        </div>
    );
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const mainContentStyle = css`
    flex: 1;
    margin-bottom: 6rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const cardContainerStyle = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0;
    display: flex;
`;

const description = css`
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    /* margin-top: 5rem; */
`;

export default Home;
