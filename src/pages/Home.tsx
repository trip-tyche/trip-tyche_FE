import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchUserInfo, postUserNickName } from '@/api/user';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import SingleInputModal from '@/components/common/Modal/SingleInputModal';
import OverLay from '@/components/common/OverLay';
import FightHeader from '@/components/layout/AirplaneHeader';
import useUserStore from '@/stores/useUserStore';
import theme from '@/styles/theme';

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
    const [_, setIsOpenModal] = useState<boolean>(false);
    const [userNickName, setUserNickName] = useState<string>('');
    const [trips, setTrips] = useState<Trip[]>();
    const [pinPoints, setPinPoints] = useState<PinPoint[]>();
    const [isFirstUser, setIsFirstUser] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const saveUserNickName = useUserStore((state) => state.saveUserNickName);

    useEffect(() => {
        const initializeUserData = async () => {
            const { userNickName, trips, pinPoints } = await fetchUserInfo();
            if (!userNickName) {
                // 첫 사용자의 경우
                setIsFirstUser(true);
                console.log('처음이네~');
                return;
            }

            setUserNickName(userNickName);
            saveUserNickName(userNickName); // userNickName 전역 상태관리
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
            <FightHeader />
            <div css={cardContainerStyle}>
                <Card trips={trips} />
            </div>

            <div css={imageStyle}>
                <LogoImages />
            </div>

            <p css={descriptionStyle}> {userNickName} 님의 여행을 기억해주세요 😀</p>

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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 80px;
`;

const cardContainerStyle = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0 2rem;
    display: flex;
`;

const imageStyle = css`
    flex: 3;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const descriptionStyle = css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${theme.fontSizes.xlarge_18};
    font-weight: 600;
    text-align: center;
    margin: 2rem 0;
`;

export default Home;
