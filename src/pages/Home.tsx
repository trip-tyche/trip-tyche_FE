import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { getUserData, postUserNickName } from '@/api/user';
import LogoImages from '@/components/common/LogoImages';
import ModalOverlay from '@/components/common/modal/ModalOverlay';
import SingleInputModal from '@/components/common/modal/SingleInputModal';
import FightHeader from '@/components/layout/AirplaneHeader';
import Card from '@/components/pages/home/Card';
import { GREETING_MESSAGE, NICKNAME_MODAL } from '@/constants/message';
import { PATH } from '@/constants/path';
import { useModalStore } from '@/stores/useModalStore';
import theme from '@/styles/theme';
import { PinPoint, Trip } from '@/types/trip';
import { getToken, getUserId } from '@/utils/auth';

const Home = (): JSX.Element => {
    const [userNickName, setUserNickName] = useState<string>('');
    const [userTrips, setUserTrips] = useState<Trip[]>();
    const [pinPoints, setPinPoints] = useState<Omit<PinPoint, 'mediaLink' | 'recordDate'>[]>();
    const [inputValue, setInputValue] = useState('');
    const { isModalOpen, openModal, closeModal } = useModalStore();
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
            const { userNickName, trips, pinPoints } = await getUserData(userId);
            if (!userNickName) {
                openModal();
            } else {
                // console.log(userNickName, trips, pinPoints);
                setUserNickName(userNickName);
                setUserTrips(trips);
                setPinPoints(pinPoints);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const submitUserNickName = async () => {
        try {
            await postUserNickName(inputValue);
            closeModal();
            fetchUserData();
        } catch (error) {
            console.error('Error post user-nickname:', error);
        }
    };

    return (
        <div css={containerStyle}>
            <FightHeader />
            <div css={cardWrapperStyle}>
                <Card trips={userTrips} />
            </div>
            <div css={imageWrapperStyle}>
                <LogoImages />
            </div>

            {userNickName && <p css={greetingMessageStyle}> {`${userNickName} ${GREETING_MESSAGE}`}</p>}
            {isModalOpen && (
                <>
                    <ModalOverlay />
                    <SingleInputModal
                        title={NICKNAME_MODAL.TITLE}
                        infoMessage={NICKNAME_MODAL.INFO_MESSAGE}
                        placeholder={NICKNAME_MODAL.PLACEHOLDER}
                        submitModal={submitUserNickName}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                </>
            )}
        </div>
    );
};

const containerStyle = css`
    padding-bottom: 80px;
`;

const cardWrapperStyle = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0 2rem;
    display: flex;
`;

const imageWrapperStyle = css`
    flex: 3;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const greetingMessageStyle = css`
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
