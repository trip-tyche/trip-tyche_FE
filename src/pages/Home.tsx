import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getTripList } from '@/api/trip';
import { postUserNickName } from '@/api/user';

import mainImage from '/public/ogami_1.png';

import Button from '@/components/common/button/Button';
import Loading from '@/components/common/Loading';
import Card from '@/components/pages/home/Card';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';
import { getToken, getUserId } from '@/utils/auth';

const Home = () => {
    const [userNickName, setUserNickName] = useState<string>();
    const [tripCount, setTripCount] = useState<number>();
    const [inputValue, setInputValue] = useState('');
    const [isOpenInputModal, setIsOpenInputModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        setIsLoading(true);
    }, []);

    const fetchUserData = async () => {
        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
            navigate(PATH.LOGIN);
            return;
        }
        const { userNickName, trips } = await getTripList();

        if (!userNickName) {
            setIsOpenInputModal(true);
        } else {
            localStorage.setItem('userNickName', userNickName);
            setUserNickName(userNickName);
            setTripCount(trips.length);
        }
    };

    const submitUserNickName = async () => {
        try {
            await postUserNickName(inputValue);
            fetchUserData();
            setIsOpenInputModal(false);
        } catch (error) {
            console.error('Error post user-nickname:', error);
        }
    };

    if (!isLoading) {
        return (
            <div css={loadingSpinnerStyle}>
                <Loading />
            </div>
        );
    }

    return (
        <div css={containerStyle}>
            {!userNickName ? (
                <div css={nicknameStyle}>
                    <div css={inputContainer}>
                        <h1>당신만의 특별한 닉네임을 지어주세요 😀</h1>
                        <input
                            type='text'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            maxLength={14}
                            placeholder='닉네임을 입력해주세요 (최대 10자)'
                            css={inputStyle(inputValue)}
                        />
                        {(inputValue.length === 1 || inputValue.length > 10) && <p>닉네임을 2~10자로 입력해주세요.</p>}
                    </div>
                    <div css={buttonContainer}>
                        <Button text='완료' btnTheme='pri' size='lg' onClick={submitUserNickName} />
                    </div>
                </div>
            ) : (
                <>
                    <div css={headerStyle}>
                        <User css={userIconStyle} onClick={() => navigate(PATH.MYPAGE)} />
                    </div>
                    <div css={contentStyle}>
                        <div css={userStyle}>
                            <img css={imageStyle} src={mainImage} alt='main-image' />
                            {userNickName ? (
                                <p css={subtitleStyle}>
                                    안녕하세요, <span css={spanStyle}>{userNickName}</span> 님
                                </p>
                            ) : (
                                <p css={subtitleStyle}>닉네임을 등록해주세요.</p>
                            )}
                        </div>
                    </div>
                    <div css={cardWrapperStyle}>
                        <Card tripCount={tripCount} />
                    </div>
                    {/* <div css={borderPassCardStyle} onClick={() => navigate(PATH.TRIP_LIST)}>
                        <h2>보더 패스</h2>
                        <p>여행 기록 시작하기</p>
                    </div> */}
                    <div css={secondButtonContainer}>
                        <Button
                            text='여행 등록하기'
                            btnTheme='pri'
                            size='lg'
                            onClick={() => navigate(PATH.TRIP_LIST)}
                        />
                    </div>
                </>
            )}

            {/* {isOpenInputModal && (
                <InputModal
                    title={NICKNAME_MODAL.TITLE}
                    infoMessage={NICKNAME_MODAL.INFO_MESSAGE}
                    placeholder={NICKNAME_MODAL.PLACEHOLDER}
                    submitModal={submitUserNickName}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )} */}
        </div>
    );
};

const nicknameStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 36px;
`;

const inputContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    height: 104px;
    padding: 0 12px;

    h1 {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: ${theme.colors.black};
    }

    p {
        margin-top: 8px;
        margin-left: 4px;
        color: #ff0101;
        font-size: ${theme.fontSizes.normal_14};
    }
`;

const baseInputStyle = css`
    border-radius: 8px;
    padding: 12px;
    font-size: ${theme.fontSizes.large_16};
    width: 100%;
    height: 38px;
    outline: none;
    margin-top: 24px;
    margin-bottom: 13;
`;

const inputStyle = (inputValue: string) => css`
    ${baseInputStyle};
    border: 1px solid ${inputValue.length === 1 || inputValue.length > 10 ? '#ff0101' : '#DDDDDD'};
    font-size: ${theme.fontSizes.large_16};
`;

const buttonContainer = css`
    width: 90%;
    padding: 0 12px;
    margin: 24px 0 12px 0;
`;

const secondButtonContainer = css`
    width: 100%;
    padding: 0 12px;
    margin: 24px 0 12px 0;
`;

const loadingSpinnerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
    background-color: #f0f0f0;
`;

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
