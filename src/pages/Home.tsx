import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import axios from 'axios';

import Card from '@/components/common/Card';
import LogoImages from '@/components/common/LogoImages';
import SingleInputModal from '@/components/common/Modal/SingleInputModal';
import OverLay from '@/components/common/OverLay';
import FightHeader from '@/components/layout/AirplaneHeader';
import useAuthStore from '@/stores/useAuthStore';
import useLoginStore from '@/stores/useLoginStore';
import useUserStore from '@/stores/useUserStore';

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

const Home = () => {
    const [_, setIsOpenModal] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [tripCountries, setTripCountries] = useState<string[]>([]);

    // const setIsLogin = useLoginStore((state) => state.setIsLogin);
    const setLogin = useAuthStore((state) => state.setLogin);
    const isFirstUser = useUserStore((state) => state.isFirstUser);
    const setIsFirstUser = useUserStore((state) => state.setIsFirstUser);

    // useEffect(() => {
    //     const getToken = async (): Promise<void> => {
    //         try {
    //             const response = await axios.get('/src/mock/token.json');
    //             const { token, user, expiresIn } = response.data;
    //             console.log(token, user, expiresIn);
    //         } catch (error) {
    //             console.error('Login failed', error);
    //         }
    //     };

    //     getToken();
    // }, []);

    // const userId = 2;
    // useEffect(() => {
    //     const getUserInfo = async (): Promise<void> => {
    //         try {
    //             const response = await axios.get(
    //                 `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/user/tripInfo?userId=${userId}`,
    //                 {
    //                     headers: {
    //                         Authorization:
    //                             'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZWRoZXJvODgzMEBnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzI1NTUyODEzLCJleHAiOjE3MjU1NTY0MTN9.mfOuHVakJMu8wTbx_oPKp5OxvnzxNqQ87HGc_OYKG6o',
    //                         'Content-Type': 'application/json',
    //                     },
    //                 },
    //             );
    //             console.log(response);
    //             // setUserId(response.data.userName);
    //         } catch (error) {
    //             console.error('==> ', error);
    //         }
    //     };

    //     // setIsLogin(true);

    //     if (isFirstUser) {
    //         setIsOpenModal(true);
    //     }

    //     getUserInfo();
    // }, []);

    const formatCountryName = (trips: Trip[]): void => {
        const countries = trips.map((trip) => trip.country);
        setTripCountries(countries);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setIsFirstUser(false);
    };

    const postUserInfo = async (): Promise<void> => {
        try {
            const response = await axios.post(
                `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/user/updateUserNickName`,
                {
                    userNickName: userName,
                },
                {
                    headers: {
                        accept: '*/*',
                        Authorization:
                            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZWRoZXJvODgzMEBnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzI1NTUyODEzLCJleHAiOjE3MjU1NTY0MTN9.mfOuHVakJMu8wTbx_oPKp5OxvnzxNqQ87HGc_OYKG6o',
                        'Content-Type': 'application/json',
                    },
                },
            );

            // formatCountryName(response.data.trips);
            // setUserInfo(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('==> ', error);
        }
    };

    // const deleteUserInfo = async (): Promise<void> => {
    //     try {
    //         const response = await axios.delete(
    //             `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips/2`,
    //             {
    //                 headers: {
    //                     accept: '*/*',
    //                     Authorization:
    //                         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZWRoZXJvODgzMEBnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzI1NTUyODEzLCJleHAiOjE3MjU1NTY0MTN9.mfOuHVakJMu8wTbx_oPKp5OxvnzxNqQ87HGc_OYKG6o',
    //                     'Content-Type': 'application/json',
    //                 },
    //             },
    //         );

    //         // formatCountryName(response.data.trips);
    //         // setUserInfo(response.data);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('==> ', error);
    //     }
    // };

    // const putUserInfo = async (): Promise<void> => {
    //     try {
    //         const response = await axios.put(
    //             `http://ec2-3-34-22-216.ap-northeast-2.compute.amazonaws.com/api/trips/1`,
    //             {
    //                 tripTitle: '아아아아앙',
    //                 country: '대한민국',
    //                 startDate: '2024-09-05',
    //                 endDate: '2024-09-05',
    //                 hashtags: ['야호'],
    //             },
    //             {
    //                 headers: {
    //                     accept: '*/*',
    //                     Authorization:
    //                         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZWRoZXJvODgzMEBnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzI1NTUyODEzLCJleHAiOjE3MjU1NTY0MTN9.mfOuHVakJMu8wTbx_oPKp5OxvnzxNqQ87HGc_OYKG6o',
    //                     'Content-Type': 'application/json',
    //                 },
    //             },
    //         );

    //         // formatCountryName(response.data.trips);
    //         // setUserInfo(response.data);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('==> ', error);
    //     }
    // };

    const submitUserName = () => {
        // postUserInfo();
        console.log(`${userName} 님이 가입했습니다.`);
        setUserName('');
        closeModal();
    };

    return (
        <div css={containerStyle}>
            <main css={mainContentStyle}>
                <FightHeader />
                <div css={cardContainerStyle}>
                    {userInfo && <Card trips={userInfo?.trips.length} tripCountries={tripCountries} />}
                </div>

                <LogoImages />

                <p css={description}> {userInfo?.userNickname} 님의 여행을 기억해주세요 😀</p>
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
