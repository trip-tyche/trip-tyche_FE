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
import { getToken, getUserId } from '@/utils/auth';

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
    const [userNickName, setUserNickName] = useState<string>('베가본드');
    const [trips, setTrips] = useState<Trip[]>();
    const [pinPoints, setPinPoints] = useState<PinPoint[]>();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const initializeUserData = async () => {
            const token = getToken();
            const userId = getUserId();

            if (!token || !userId) {
                console.error('Token or userId not found');
                // 로그인 페이지로 리다이렉트 또는 다른 처리
                return;
            }

            try {
                const { userNickname, trips, pinPoints } = await fetchUserInfo();

                if (!userNickname) {
                    return;
                }
                console.log(userNickname, trips, pinPoints);
                setUserNickName(userNickname);
                setTrips(trips);
                setPinPoints(pinPoints);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        initializeUserData();
    }, [userNickName]);

    const closeModal = () => {
        setIsOpenModal(false);
    };
    const submitUserNickName = async () => {
        try {
            await postUserNickName(inputValue);
            setUserNickName(inputValue);
            setInputValue('');
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
            {!userNickName && (
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
