import { Dispatch, SetStateAction } from 'react';

import { css } from '@emotion/react';
import { Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconPlane, IconCalendar, IconWorld } from '@tabler/icons-react';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import Input from '@/components/common/Input';
import { COUNTRY_OPTIONS, HASHTAG_MENU, TRIP_FORM } from '@/constants/trip';
import { useTripDateRange } from '@/hooks/useTripDateRange';
import theme from '@/styles/theme';
import { TripInfoModel } from '@/types/trip';
import { formatDateToKoreanYear } from '@/utils/date';

interface TripEditFormProps {
    tripInfo: TripInfoModel;
    setTripInfo: Dispatch<SetStateAction<TripInfoModel>>;
}

const TripEditForm = ({ tripInfo, setTripInfo }: TripEditFormProps) => {
    const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;

    const imageDates = [startDate, endDate];
    const defaultStartDate = imageDates[0] || null;
    const defaultEndDate = imageDates[imageDates.length - 1] || null;

    const {
        dateRange,
        isError,
        handleDateChange,
        handleDateMouseEnter,
        handleDateMouseLeave,
        isInRange,
        isStartOrEndDate,
    } = useTripDateRange({
        imageDates,
        setTripInfo,
    });

    const handleHashtagToggle = (tag: string) => {
        setTripInfo((prev: TripInfoModel) => {
            if (prev.hashtags.includes(tag)) {
                return { ...prev, hashtags: prev.hashtags.filter((hashtag) => hashtag !== tag) };
            }

            if (prev.hashtags.length >= 3) {
                return prev;
            }

            return { ...prev, hashtags: [...prev.hashtags, tag] };
        });
    };

    const countryData = COUNTRY_OPTIONS.map((country) => ({
        value: `${country.value}`,
        label: `${country.emoji} ${country.nameKo}`,
    }));

    return (
        <div css={tripInfoFormContainer}>
            <div>
                <div css={titleStyle}>
                    <h2>{TRIP_FORM.DATE}</h2>
                    <p css={descriptionStyle}>여행 기간은 수정이 불가합니다.</p>
                </div>
                <DatePickerInput
                    type='range'
                    placeholder='여행 시작일과 종료일을 선택하세요'
                    value={[startDate ? dayjs(startDate).toDate() : null, endDate ? dayjs(endDate).toDate() : null]}
                    leftSection={<IconCalendar size={16} />}
                    locale='ko'
                    size='md'
                    valueFormat='YYYY년 MM월 DD일'
                    readOnly={true}
                    disabled
                />
            </div>

            <div>
                <h2 css={titleStyle}>{TRIP_FORM.COUNTRY}</h2>
                <Select
                    placeholder={TRIP_FORM.COUNTRY_DEFAULT}
                    data={countryData}
                    value={country}
                    onChange={(value) => setTripInfo({ ...tripInfo, country: value || '' })}
                    searchable
                    nothingFoundMessage='검색하신 국가를 찾을 수 없습니다.'
                    checkIconPosition='right'
                    leftSection={<IconWorld size={16} />}
                    size='md'
                    radius='md'
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 }, dropdownPadding: 6 }}
                />
            </div>

            <div>
                <h2 css={titleStyle}>{TRIP_FORM.TITLE}</h2>
                <Input
                    value={tripTitle}
                    onChange={(value) => setTripInfo({ ...tripInfo, tripTitle: value })}
                    placeholder='최대 12자까지 입력할 수 있습니다'
                    maxLength={12}
                    leftSection={<IconPlane size={16} />}
                />
            </div>

            <div>
                <div css={titleStyle}>
                    <h2>{TRIP_FORM.HASHTAG}</h2>
                    <p css={descriptionStyle}>최대 3개까지 선택할 수 있습니다.</p>
                </div>
                <div css={hashtagGroup}>
                    {HASHTAG_MENU.map((tag) => (
                        <button
                            key={tag}
                            css={[buttonBaseStyle, hashtags.includes(tag) ? selectedButtonStyle : defaultButtonStyle]}
                            onClick={() => handleHashtagToggle(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const tripInfoFormContainer = css`
    display: flex;
    flex-direction: column;
    gap: 28px;
`;

const titleStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${theme.fontSizes.normal_14};
    font-weight: bold;
    color: ${theme.colors.black};
    margin-bottom: 12px;
`;

const descriptionStyle = css`
    font-size: ${theme.fontSizes.small_12};
    font-weight: normal;
    color: ${theme.colors.descriptionText};
`;

const hashtagGroup = css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const buttonBaseStyle = css`
    padding: 0 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 0;
    height: 28px;
    font-weight: 600;

    &:active {
        transform: translateY(1px);
    }
`;

const selectedButtonStyle = css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
`;

const defaultButtonStyle = css`
    background-color: #868e961a;
    color: #868e96;
`;

const errorStyle = css`
    margin-top: 6px;
    margin-left: 4px;
    font-size: ${theme.fontSizes.small_12};
    color: ${theme.colors.error};
`;

export default TripEditForm;
