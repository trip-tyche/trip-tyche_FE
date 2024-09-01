import React, { useState } from 'react';

// import { FaChevronLeft, FaCalendarAlt } from 'react-icons/fa';
import { css } from '@emotion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import Button from '@/components/common/Button/Button';
import Header from '@/components/layout/Header';
import 'react-toastify/dist/ReactToastify.css';

const TripCreateInfo: React.FC = () => {
    const [title, setTitle] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
    const navigate = useNavigate();
    const hashtags = ['가족', '친구', '연인', '즐거운', '도전', '공포', '우울한', '나홀자'];

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/server/getTrips.json', {
                title,
                country,
                startDate,
                endDate,
                hashtag: selectedHashtag,
            });

            if (response.status === 200 || response.status === 201) {
                toast.success('여행 정보가 성공적으로 등록되었습니다!');
                setTimeout(() => {
                    navigate('/trips/new/file');
                }, 2000);
            }
        } catch (error) {
            toast.error('여행 등록에 실패했습니다. 다시 시도해주세요.');
            console.error('Trip registration failed:', error);
        }
    };
    const handleError = () => {
        toast.error('여행 등록에 실패했습니다. 다시 시도해주세요.');
    };

    return (
        <div css={containerStyle}>
            {/* <header css={headerStyle}>
                <FaChevronLeft onClick={handleGoBack} css={backButtonStyle} />
                <h1>여행 등록</h1>
            </header> */}
            <Header title='여행관리' isBackButton={true} onClick={() => navigate('/trips')} />

            <main css={mainStyle}>
                <section css={sectionStyle}>
                    <label htmlFor='title'>여행 제목</label>
                    <input
                        id='title'
                        type='text'
                        placeholder='여행 제목을 입력하세요'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        css={inputStyle}
                    />
                </section>

                <section css={sectionStyle}>
                    <label htmlFor='country'>여행 국가</label>
                    <select id='country' value={country} onChange={(e) => setCountry(e.target.value)} css={inputStyle}>
                        <option value=''>국가를 선택하세요</option>
                        <option value='KR'>🇰🇷 한국</option>
                        <option value='JP'>🇯🇵 일본</option>
                        <option value='US'>🇺🇸 미국</option>
                    </select>
                </section>

                <section css={dateContainerStyle}>
                    <div css={dateFieldStyle}>
                        <label htmlFor='startDate'>시작 날짜</label>
                        <div css={dateInputContainerStyle}>
                            {/* <FaCalendarAlt css={calendarIconStyle} /> */}
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
                            {/* <FaCalendarAlt css={calendarIconStyle} /> */}
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
                        {hashtags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedHashtag(tag)}
                                css={[hashtagStyle, selectedHashtag === tag && selectedHashtagStyle]}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>
            </main>

            {/* <button onClick={handleSubmit} css={submitButtonStyle}>
                다음
                </button> */}
            <div css={submitButtonStyle}>
                <Button text='다음' theme='sec' size='sm' onClick={handleSubmit} />
            </div>
            <div css={submitButtonStyle}>
                <Button text='실패' theme='sec' size='sm' onClick={handleError} />
            </div>
            <ToastContainer position='top-center' autoClose={2000} />
        </div>
    );
};

const containerStyle = css`
    font-family: 'Noto Sans KR', sans-serif;
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
        font-weight: bold;
        font-size: 14px;
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
        font-size: 12px;
        font-size: 14px;
        font-weight: bold;
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
