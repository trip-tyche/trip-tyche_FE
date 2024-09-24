import { Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';

import { COUNTRY_OPTIONS, HASHTAG_MENU, NEW_COUNTRY } from '@/constants/trip';
import theme from '@/styles/theme';
import { TripInfo } from '@/types/trip';

interface TripFormProps extends TripInfo {
    setTripTitle: Dispatch<SetStateAction<string>>;
    setCountry: Dispatch<SetStateAction<string>>;
    setStartDate: Dispatch<SetStateAction<string>>;
    setEndDate: Dispatch<SetStateAction<string>>;
    setHashtags: Dispatch<SetStateAction<string[]>>;
}

const TripForm = ({
    tripTitle,
    setTripTitle,
    country,
    setCountry,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    hashtags,
    setHashtags,
}: TripFormProps): JSX.Element => (
    <>
        <div css={containerStyle}>
            <section css={sectionStyle}>
                <label htmlFor='title'>{NEW_COUNTRY.TITLE}</label>
                <input
                    id='tripTitle'
                    name='tripTitle'
                    type='text'
                    placeholder={NEW_COUNTRY.TITLE_PLACEHOLDER}
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    css={inputStyle}
                />
            </section>

            <section css={sectionStyle}>
                <label htmlFor='country'>{NEW_COUNTRY.COUNTRY}</label>
                <select
                    id='country'
                    name='country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    css={inputStyle}
                >
                    <option value=''>{NEW_COUNTRY.COUNTRY_DEFAULT}</option>
                    {COUNTRY_OPTIONS.map((county) => (
                        <option key={county.emoji} value={`${county.emoji} ${county.name}`}>
                            {`${county.emoji} ${county.name}`}
                        </option>
                    ))}
                </select>
            </section>

            <section css={dateContainerStyle}>
                <div css={dateFieldStyle}>
                    <label htmlFor='startDate'>{NEW_COUNTRY.START_DATE}</label>
                    <div css={dateInputContainerStyle}>
                        <input
                            id='startDate'
                            name='startDate'
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            css={dateInputStyle}
                        />
                    </div>
                </div>
                <div css={dateFieldStyle}>
                    <label htmlFor='endDate'>{NEW_COUNTRY.END_DATE}</label>
                    <div css={dateInputContainerStyle}>
                        <input
                            id='endDate'
                            name='endDate'
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
                    {HASHTAG_MENU.map((tag) => (
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
        </div>
    </>
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

export default TripForm;
