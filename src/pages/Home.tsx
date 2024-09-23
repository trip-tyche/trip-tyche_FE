import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { fetchUserInfo, postUserNickName } from '@/api/user';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import SingleInputModal from '@/components/common/Modal/SingleInputModal';
import OverLay from '@/components/common/OverLay';
import FightHeader from '@/components/layout/AirplaneHeader';
import { useModalStore } from '@/stores/useModalStore';
import theme from '@/styles/theme';
import { PinPoint, Trip } from '@/types/trip';
import { getToken, getUserId } from '@/utils/auth';

const Home = () => {
    const { isModalOpen, openModal, closeModal } = useModalStore();
    const [userNickName, setUserNickName] = useState<string>('');
    const [trips, setTrips] = useState<Trip[]>();
    const [pinPoints, setPinPoints] = useState<PinPoint[]>();
    const [inputValue, setInputValue] = useState('');

    const fetchUserData = async () => {
        const token = getToken();
        const userId = getUserId();
        if (!token || !userId) {
            console.error('Token or userId not found');
            // 로그인 페이지로 리다이렉트 또는 다른 처리
            return;
        }
        try {
            const { userNickName, trips, pinPoints } = await fetchUserInfo(userId);
            if (!userNickName) {
                openModal();
            } else {
                console.log(userNickName, trips, pinPoints);
                setUserNickName(userNickName);
                setTrips(trips);
                setPinPoints(pinPoints);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const submitUserNickName = async () => {
        try {
            await postUserNickName(inputValue);
            fetchUserData();
            closeModal();
        } catch (error) {
            console.error('닉네임 설정 중 오류 발생:', error);
        }
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

            {userNickName && <p css={descriptionStyle}> {userNickName} 님의 여행을 기억해주세요 😀</p>}
            {isModalOpen && (
                <>
                    <OverLay />
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
