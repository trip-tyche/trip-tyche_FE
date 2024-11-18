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

interface TripFormProps {
    imageDates?: string[];
    tripInfo: TripInfoModel;
    setTripInfo: Dispatch<SetStateAction<TripInfoModel>>;
}

const TripForm = ({ imageDates = [], tripInfo, setTripInfo }: TripFormProps) => {
    // const { tripTitle, country, hashtags } = tripInfo;
    const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;

    const defaultStartDate = imageDates[0] || startDate || null;
    const defaultEndDate = imageDates[imageDates.length - 1] || endDate || null;

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
                    <p css={descriptionStyle}>사진이 있는 날짜는 파란점으로 표시됩니다.</p>
                </div>
                <DatePickerInput
                    type='range'
                    placeholder={`${formatDateToKoreanYear(defaultStartDate)} ~ ${formatDateToKoreanYear(defaultEndDate)}`}
                    value={dateRange}
                    defaultDate={imageDates[0] ? new Date(imageDates[0]) : undefined}
                    onChange={handleDateChange}
                    onMouseLeave={handleDateMouseLeave}
                    leftSection={<IconCalendar size={16} />}
                    locale='ko'
                    aria-hidden='false'
                    size='md'
                    radius='md'
                    valueFormat='YYYY년 MM월 DD일'
                    popoverProps={{ position: 'bottom' }}
                    getDayProps={(date) => ({
                        onMouseEnter: () => handleDateMouseEnter(date),
                        style: {
                            ...(isStartOrEndDate(date)
                                ? { backgroundColor: theme.colors.primary, color: 'white' }
                                : isInRange(date)
                                  ? { backgroundColor: '#3d4e8117' }
                                  : {}),
                        },
                    })}
                    renderDay={(date) => {
                        const isImage = imageDates.some(
                            (imageDate) => dayjs(imageDate).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD'),
                        );

                        return (
                            <div style={{ position: 'relative' }}>
                                {date.getDate()}
                                {isImage && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '5px',
                                            height: '5px',
                                            backgroundColor: isStartOrEndDate(date) ? 'white' : theme.colors.primary,
                                            borderRadius: '50%',
                                            zIndex: 2,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    }}
                />
                {isError && (
                    <p css={errorStyle}>선택하신 여행 기간 외에도 사진이 있습니다. 기간을 다시 확인해 주세요.</p>
                )}
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
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 0;
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

export default TripForm;
