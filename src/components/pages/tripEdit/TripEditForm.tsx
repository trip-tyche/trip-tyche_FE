import { css } from '@emotion/react';

import { HASHTAG_MENU } from '@/constants/trip';
import theme from '@/styles/theme';
import { TripInfo } from '@/types/trip';

interface TripEditFormProps {
    tripData: TripInfo;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleHashtagToggle: (tag: string) => void;
}

const TripEditForm = ({ tripData, handleInputChange, handleHashtagToggle }: TripEditFormProps): JSX.Element => (
    <div css={containerStyle}>
        <section css={sectionStyle}>
            <label htmlFor='tripTitle'>여행 제목</label>
            <input
                id='tripTitle'
                name='tripTitle'
                type='text'
                value={tripData?.tripTitle}
                onChange={handleInputChange}
                css={inputStyle}
            />
        </section>

        <section css={sectionStyle}>
            <label htmlFor='country'>여행 국가</label>
            <select id='country' name='country' value={tripData?.country} onChange={handleInputChange} css={inputStyle}>
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
                <option value='🇵🇹 포르투갈'>🇵🇹 포르투갈</option>
            </select>
        </section>

        <section css={dateContainerStyle}>
            <div css={dateFieldStyle}>
                <label htmlFor='startDate'>시작 날짜</label>
                <input
                    id='startDate'
                    name='startDate'
                    type='date'
                    value={tripData?.startDate}
                    onChange={handleInputChange}
                    css={dateInputStyle}
                />
            </div>
            <div css={dateFieldStyle}>
                <label htmlFor='endDate'>종료 날짜</label>
                <input
                    id='endDate'
                    name='endDate'
                    type='date'
                    value={tripData?.endDate}
                    onChange={handleInputChange}
                    css={dateInputStyle}
                />
            </div>
        </section>

        <section css={sectionStyle}>
            <label>해시태그</label>
            <div css={hashtagContainerStyle}>
                {HASHTAG_MENU.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleHashtagToggle(tag)}
                        css={[hashtagStyle, tripData?.hashtags.includes(tag) && selectedHashtagStyle]}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </section>
    </div>
);

const containerStyle = css`
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

export default TripEditForm;