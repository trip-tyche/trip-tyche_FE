import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import axios from 'axios';

import S3Test from '../../server/S3Test';
import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import SingleInputModal from '@/components/common/Modal/SingleInputModal';
import Navbar from '@/components/common/Navbar';
import OverLay from '@/components/common/OverLay';
import FightHeader from '@/components/layout/Header/AirplaneHeader';
import useFirstUser from '@/stores/FirstUser';
import useLoginState from '@/stores/LoginState';

// import { getCode, getName } from 'country-list';
interface Trip {
    tripId: number;
    country: string;
}
interface PinPoint {
    tripId: number;
    pinPointId: string;
    latitude: number;
    longitude: number;
}
interface UserInfo {
    userId: number;
    userNickname: string;
    trips: Trip[];
    pinPoints: PinPoint[];
}

export default function Home() {
    const setIsLogin = useLoginState((state) => state.setIsLogin);
    const isFirstUser = useFirstUser((state) => state.isFirstUser);
    const setIsFirstUser = useFirstUser((state) => state.setIsFirstUser);
    const [_, setIsOpenModal] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [tripCountries, setTripCountries] = useState<string[]>([]);

    useEffect(() => {
        setIsLogin(true);
        checkFirstUser();
    }, []);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const formatCountryName = (trips: Trip[]): void => {
        const countries = trips.map((trip) => trip.country);
        setTripCountries(countries);
    };

    const fetchUserInfo = async (): Promise<void> => {
        try {
            const response = await axios.get('/server/userInfo.json');
            formatCountryName(response.data.trips);
            setUserInfo(response.data);
        } catch (error) {
            console.error('==> ', error);
        }
    };

    const checkFirstUser = () => {
        if (isFirstUser) setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setIsFirstUser(false);
    };

    const submitUserName = () => {
        console.log(`${userName} 님이 가입했습니다.`);
        setUserName('');
        closeModal();
    };

    return (
        <div css={containerStyle}>
            {/* <main css={mainContentStyle}>
                <FightHeader />
                <div css={cardContainerStyle}>
                    {userInfo && <Card trips={userInfo?.trips.length} tripCountries={tripCountries} />}
                </div>

                <LogoImages />

                <p css={description}> {userInfo?.userNickName} 님의 여행을 기억해주세요 😀</p>
            </main>

            {isFirstUser && (
                <>
                    <OverLay closeModal={closeModal} />
                    <SingleInputModal
                        titleText='당신의 이름을 알려주세요'
                        descriptionText='한국어, 영어, 숫자 등 최소 4자리를 입력해주세요.'
                        exampleText='(예. 동남아킬러24)'
                        submitModal={submitUserName}
                        setInputValue={setUserName}
                        value={userName}
                    />
                </>
            )} */}
            <S3Test />
            {/* <Navbar /> */}
        </div>
    );
}

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
