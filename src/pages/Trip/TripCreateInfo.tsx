import React, { useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { postTripInfo } from '@/api/trips';
import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header';
import 'react-toastify/dist/ReactToastify.css';
import theme from '@/styles/theme';

const TripCreateInfo: React.FC = () => {
    const [tripTitle, setTitle] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const navigate = useNavigate();
    const hashtagsMenus = [
        '가족과함께',
        '베스트프렌즈',
        '연인과의시간',
        '즐거운순간',
        '도전',
        '소소한두려움',
        '우울탈출',
        '혼자서도괜찮아',
        '행복한시간',
        '용기있는도전',
        '특별한순간',
        '감정여행',
        '나를위한여행',
    ];

    const submitTripInfo = async () => {
        try {
            const response = await postTripInfo({ tripTitle, country, startDate, endDate, hashtags });
            const { tripId } = response;
            navigate('/trips/upload', { state: { tripId, tripTitle } });
        } catch (error) {
            console.error('닉네임 설정 중 오류 발생:', error);
        }
    };

    return (
        <div css={containerStyle}>
            <Header title='여행 등록' isBackButton={true} onClick={() => navigate(-1)} />

            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <label htmlFor='title'>여행 제목</label>
                    <input
                        id='title'
                        type='text'
                        placeholder='여행 제목을 입력하세요'
                        value={tripTitle}
                        onChange={(e) => setTitle(e.target.value)}
                        css={inputStyle}
                    />
                </section>

                <section css={sectionStyle}>
                    <label htmlFor='country'>여행 국가</label>
                    <select id='country' value={country} onChange={(e) => setCountry(e.target.value)} css={inputStyle}>
                        <option value=''>국가를 선택하세요</option>
                        <option value='🇰🇷 한국'>🇰🇷 한국</option>
                        <option value='🇯🇵 일본'>🇯🇵 일본</option>
                        <option value='🇺🇸 미국'>🇺🇸 미국</option>
                        <option value='🇨🇳 중국'>🇨🇳 중국</option>
                        <option value='🇮🇳 인도'>🇮🇳 인도</option>
                        <option value='🇬🇧 영국'>🇬🇧 영국</option>
                        <option value='🇩🇪 독일'>🇩🇪 독일</option>
                        <option value='🇫🇷 프랑스'>🇫🇷 프랑스</option>
                        <option value='🇮🇹 이탈리아'>🇮🇹 이탈리아</option>
                        <option value='🇧🇷 브라질'>🇧🇷 브라질</option>
                        <option value='🇷🇺 러시아'>🇷🇺 러시아</option>
                        <option value='🇨🇦 캐나다'>🇨🇦 캐나다</option>
                        <option value='🇦🇺 호주'>🇦🇺 호주</option>
                        <option value='🇲🇽 멕시코'>🇲🇽 멕시코</option>
                        <option value='🇪🇸 스페인'>🇪🇸 스페인</option>
                        <option value='🇦🇷 아르헨티나'>🇦🇷 아르헨티나</option>
                        <option value='🇿🇦 남아프리카 공화국'>🇿🇦 남아프리카 공화국</option>
                        <option value='🇳🇬 나이지리아'>🇳🇬 나이지리아</option>
                        <option value='🇸🇦 사우디아라비아'>🇸🇦 사우디아라비아</option>
                        <option value='🇹🇷 터키'>🇹🇷 터키</option>
                        <option value='🇮🇩 인도네시아'>🇮🇩 인도네시아</option>
                        <option value='🇹🇭 태국'>🇹🇭 태국</option>
                        <option value='🇻🇳 베트남'>🇻🇳 베트남</option>
                        <option value='🇪🇬 이집트'>🇪🇬 이집트</option>
                        <option value='🇵🇭 필리핀'>🇵🇭 필리핀</option>
                        <option value='🇵🇰 파키스탄'>🇵🇰 파키스탄</option>
                        <option value='🇧🇩 방글라데시'>🇧🇩 방글라데시</option>
                        <option value='🇵🇱 폴란드'>🇵🇱 폴란드</option>
                        <option value='🇳🇱 네덜란드'>🇳🇱 네덜란드</option>
                        <option value='🇸🇪 스웨덴'>🇸🇪 스웨덴</option>
                        <option value='🇨🇭 스위스'>🇨🇭 스위스</option>
                    </select>
                </section>

                <section css={dateContainerStyle}>
                    <div css={dateFieldStyle}>
                        <label htmlFor='startDate'>시작 날짜</label>
                        <div css={dateInputContainerStyle}>
                            <input
                                id='startDate'
                                type='date'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                css={dateInputStyle}
                            />
                        </div>
                    </div>
                    <div css={dateFieldStyle}>
                        <label htmlFor='endDate'>종료 날짜</label>
                        <div css={dateInputContainerStyle}>
                            <input
                                id='endDate'
                                type='date'
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                css={dateInputStyle}
                            />
                        </div>
                    </div>
                </section>

                <section css={sectionStyle}>
                    <label>해시태그</label>
                    <div css={hashtagContainerStyle}>
                        {hashtagsMenus.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setHashtags([...hashtags, tag])}
                                css={[hashtagStyle, hashtags.includes(tag) && selectedHashtagStyle]}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>
            </main>

            <div css={submitButtonStyle}>
                <Button text='다음' theme='sec' size='sm' onClick={submitTripInfo} />
            </div>
        </div>
    );
};

const containerStyle = css`
    min-height: 100vh;
`;

const mainStyle = css`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

const sectionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 14px;
    label {
        font-weight: 600;
        font-size: ${theme.fontSizes.normal_14};
    }
`;

const inputStyle = css`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
`;

const dateContainerStyle = css`
    display: flex;
    gap: 20px;
`;

const dateFieldStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 0px;
    gap: 12px;

    label {
        font-size: ${theme.fontSizes.normal_14};
        font-weight: 600;
    }
`;

const dateInputContainerStyle = css`
    position: relative;
    flex: 1;
`;

const dateInputStyle = css`
    ${inputStyle}
    /* padding-left: 35px; */
    width: 100%;
    box-sizing: border-box;
`;

const hashtagContainerStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const hashtagStyle = css`
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0e0e0;
    }
`;

const selectedHashtagStyle = css`
    background-color: #333;
    color: white;
`;

const submitButtonStyle = css`
    color: white;
    margin-top: 60px;
    display: flex;
    padding: 20px;
    justify-content: end;
`;

export default TripCreateInfo;
