import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Select } from '@mantine/core';
import { DatePickerInput, DayProps, DateValue, DatesRangeValue } from '@mantine/dates';
import { IconPlane, IconCalendar, IconWorld } from '@tabler/icons-react';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import Input from '@/components/common/Input';
import { COUNTRY_OPTIONS, HASHTAG_MENU, TRIP_FORM } from '@/constants/trip';
import { useTripDateRange } from '@/hooks/useTripDateRange';
import theme from '@/styles/theme';
import { FormMode } from '@/types/common';
import { TripModelWithoutTripId } from '@/types/trip';
import { formatDateToKoreanYear } from '@/utils/date';

type DateSelectType = 'range' | 'single';
type DateChangeHandler = (value: DateValue | DatesRangeValue) => void;
interface TripInfoFormProps {
    mode: FormMode;
    tripInfo: TripModelWithoutTripId;
    setTripInfo: Dispatch<SetStateAction<TripModelWithoutTripId>>;
}

const TripInfoForm = ({ mode, tripInfo, setTripInfo }: TripInfoFormProps) => {
    const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;

    const [dateSelectType, setDateSelectType] = useState<DateSelectType>('range');

    const isEditing = mode === 'edit';
    const isSelectRange = dateSelectType === 'range';
    const imageDates = isEditing ? [] : (JSON.parse(localStorage.getItem('image-date') || '[]') as string[]);
    const defaultStartDate = imageDates[0];
    const defaultEndDate = imageDates[imageDates.length - 1];

    const datePickerProps = useTripDateRange({
        imageDates,
        setTripInfo,
        isEditing,
    });

    useEffect(() => {
        if (!isEditing) {
            datePickerProps?.resetDates();
        }
    }, [dateSelectType]);

    const handleHashtagSelect = (tag: string) => {
        setTripInfo((prev: TripModelWithoutTripId) => {
            if (prev.hashtags.includes(tag)) {
                return { ...prev, hashtags: prev.hashtags.filter((hashtag) => hashtag !== tag) };
            }

            if (prev.hashtags.length >= 3) {
                return prev;
            }

            return { ...prev, hashtags: [...prev.hashtags, tag] };
        });
    };

    const handleDateChange: DateChangeHandler = (value) => {
        if (dateSelectType === 'range' && Array.isArray(value)) {
            datePickerProps?.handleRangeDateChange(value as [DateValue, DateValue]);
        } else if (dateSelectType === 'single' && !Array.isArray(value)) {
            datePickerProps?.handleSingleDateChange(value as DateValue);
        }
    };

    const renderCustomDay = (date: Date) => {
        if (isEditing) {
            return date.getDate();
        }

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
                            backgroundColor: datePickerProps?.isStartOrEndDate(date) ? 'white' : theme.colors.primary,
                            borderRadius: '50%',
                            zIndex: 2,
                        }}
                    />
                )}
            </div>
        );
    };

    const countryData = COUNTRY_OPTIONS.map((country) => ({
        value: `${country.value}`,
        label: `${country.emoji} ${country.nameKo}`,
    }));

    return (
        <div css={tripInfoFormContainer}>
            <section>
                <div css={titleStyle}>
                    <h2>{TRIP_FORM.DATE}</h2>
                    {!isEditing && (
                        <Select
                            value={dateSelectType}
                            onChange={(value) => setDateSelectType(value as DateSelectType)}
                            data={[
                                { value: 'range', label: '기간 선택' },
                                { value: 'single', label: '하루 선택' },
                            ]}
                            size='xs'
                            radius='sm'
                            allowDeselect={false}
                            w={100}
                            styles={{
                                input: {
                                    fontWeight: 500,
                                },
                            }}
                        />
                    )}
                </div>
                <DatePickerInput
                    type={isSelectRange ? 'range' : 'default'}
                    placeholder={
                        isEditing
                            ? undefined
                            : isSelectRange
                              ? `${formatDateToKoreanYear(defaultStartDate)} ${formatDateToKoreanYear(defaultEndDate) ? `~ ${formatDateToKoreanYear(defaultEndDate)}` : ''}`
                              : `${formatDateToKoreanYear(defaultStartDate)}`
                    }
                    value={
                        isEditing
                            ? isSelectRange
                                ? [
                                      startDate ? dayjs(startDate).toDate() : null,
                                      endDate ? dayjs(endDate).toDate() : null,
                                  ]
                                : startDate
                                  ? dayjs(startDate).toDate()
                                  : null
                            : isSelectRange
                              ? datePickerProps?.dateRange
                              : datePickerProps?.selectedDate
                    }
                    leftSection={<IconCalendar size={16} />}
                    locale='ko'
                    size='md'
                    radius='md'
                    valueFormat='YYYY년 MM월 DD일'
                    defaultDate={isEditing ? undefined : imageDates[0] ? new Date(imageDates[0]) : undefined}
                    onChange={isEditing ? undefined : handleDateChange}
                    onMouseLeave={isEditing ? undefined : datePickerProps?.handleDateMouseLeave}
                    popoverProps={{ position: 'bottom' }}
                    getDayProps={(date: Date) => {
                        const defaultProps: Omit<Partial<DayProps>, 'classNames' | 'styles' | 'vars'> = {
                            disabled: false,
                            onMouseEnter: () => {},
                            selected: false,
                        };

                        return isEditing
                            ? defaultProps
                            : (datePickerProps?.getCustomDayProps(
                                  date,
                                  datePickerProps.handleDateMouseEnter,
                                  dateSelectType,
                              ) ?? defaultProps);
                    }}
                    renderDay={(date) => renderCustomDay(date)}
                    disabled={isEditing}
                />
                {datePickerProps?.isError ? (
                    <p css={errorStyle}>
                        선택하신 날짜 외에도 사진이 있습니다. {isSelectRange && '기간을 다시 확인해 주세요.'}
                    </p>
                ) : (
                    <p css={dateDescriptionStyle}>
                        {isEditing ? '여행 기간은 수정이 불가합니다' : '사진이 있는 날짜는 파란점으로 표시됩니다'}
                    </p>
                )}
            </section>

            <section>
                <h2 css={titleStyle}>{TRIP_FORM.COUNTRY}</h2>
                <Select
                    placeholder={TRIP_FORM.COUNTRY_DEFAULT}
                    data={countryData}
                    value={country}
                    onChange={(value) => setTripInfo({ ...tripInfo, country: value || '' })}
                    checkIconPosition='right'
                    leftSection={<IconWorld size={16} />}
                    size='md'
                    radius='md'
                    allowDeselect={false}
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 }, dropdownPadding: 6 }}
                />
            </section>

            <section>
                <h2 css={titleStyle}>{TRIP_FORM.TITLE}</h2>
                <Input
                    value={tripTitle}
                    onChange={(value) => setTripInfo({ ...tripInfo, tripTitle: value })}
                    placeholder='최대 12자까지 입력할 수 있습니다'
                    maxLength={12}
                    leftSection={<IconPlane size={16} />}
                />
            </section>

            <section>
                <div css={titleStyle}>
                    <h2>{TRIP_FORM.HASHTAG}</h2>
                    <p css={baseDescriptionStyle}>최대 3개까지 선택할 수 있습니다</p>
                </div>
                <div css={hashtagGroup}>
                    {HASHTAG_MENU.map((tag) => (
                        <button
                            key={tag}
                            css={[buttonBaseStyle, hashtags.includes(tag) ? selectedButtonStyle : defaultButtonStyle]}
                            onClick={() => handleHashtagSelect(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </section>
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

    &:active {
        transform: translateY(1px);
    }
`;

const selectedButtonStyle = css`
    font-weight: bold;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
`;

const defaultButtonStyle = css`
    background-color: #868e961a;
    color: #868e96;
`;

const baseDescriptionStyle = css`
    font-size: ${theme.fontSizes.small_12};
    font-weight: normal;
    color: ${theme.colors.descriptionText};
`;

const dateDescriptionStyle = css`
    ${baseDescriptionStyle}
    margin-top: 6px;
    margin-left: 4px;
`;

const errorStyle = css`
    margin-top: 6px;
    margin-left: 4px;
    font-size: ${theme.fontSizes.small_12};
    color: ${theme.colors.error};
`;

export default TripInfoForm;
