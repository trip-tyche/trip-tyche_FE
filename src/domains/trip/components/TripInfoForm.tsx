import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { Select } from '@mantine/core';
import { DatePickerInput, DayProps, DateValue, DatesRangeValue } from '@mantine/dates';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { Plane, Calendar, Globe } from 'lucide-react';

import { COUNTRIES, FORM } from '@/domains/trip/constants';
import { useTripDateRange } from '@/domains/trip/hooks/useTripDateRange';
import { Trip } from '@/domains/trip/types';
import { formatToKorean } from '@/libs/utils/date';
import Input from '@/shared/components/common/Input';
import theme from '@/shared/styles/theme';

type DateSelectType = 'range' | 'single';
type DateChangeHandler = (value: DateValue | DatesRangeValue) => void;
interface TripInfoFormProps {
    isEditing?: boolean;
    tripInfo: Trip;
    onChangeTripInfo: Dispatch<SetStateAction<Trip>>;
}

const TripInfoForm = ({ isEditing = false, tripInfo, onChangeTripInfo }: TripInfoFormProps) => {
    const { tripTitle, country, startDate, endDate, hashtags, mediaFilesDates: imageDates = [] } = tripInfo;
    const [dateSelectType, setDateSelectType] = useState<DateSelectType>('range');
    const [isSelectRange, setIsSelectRange] = useState<boolean>(true);

    const defaultStartDate = imageDates[0];
    const defaultEndDate = imageDates[imageDates.length - 1];

    const datePickerProps = useTripDateRange({
        imageDates,
        onChangeTripInfo,
    });

    useEffect(() => {
        if (imageDates.length === 1) {
            setIsSelectRange(false);
            setDateSelectType('single');
        }
    }, []);

    useEffect(() => {
        if (!isEditing) {
            datePickerProps?.resetDates();
        }
    }, [dateSelectType]);

    const handleHashtagSelect = (tag: string) => {
        onChangeTripInfo((prev: Trip) => {
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
                            backgroundColor: datePickerProps?.isStartOrEndDate(date) ? 'white' : theme.COLORS.PRIMARY,
                            borderRadius: '50%',
                            zIndex: 2,
                        }}
                    />
                )}
            </div>
        );
    };

    const countryData = COUNTRIES.map((country) => ({
        value: `${country.value}`,
        label: `${country.emoji} ${country.nameKo}`,
    }));

    return (
        <div css={container}>
            <section>
                <div css={titleStyle}>
                    <h2>{FORM.TITLE.DATE}</h2>
                    <Select
                        value={dateSelectType}
                        onChange={(value) => {
                            setDateSelectType(value as DateSelectType);
                            setIsSelectRange(!isSelectRange);
                        }}
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
                </div>
                <DatePickerInput
                    type={isSelectRange ? 'range' : 'default'}
                    placeholder={
                        isSelectRange
                            ? `${formatToKorean(defaultStartDate, true)} ${formatToKorean(defaultEndDate, true) ? `~ ${formatToKorean(defaultEndDate, true)}` : ''}`
                            : `${formatToKorean(defaultStartDate, true)}`
                    }
                    value={
                        datePickerProps.isInitialized
                            ? isSelectRange
                                ? [startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null]
                                : startDate
                                  ? new Date(startDate)
                                  : null
                            : isSelectRange
                              ? datePickerProps?.dateRange
                              : datePickerProps?.selectedDate
                    }
                    leftSection={<Calendar size={16} />}
                    locale='ko'
                    size='md'
                    radius='md'
                    valueFormat='YYYY년 MM월 DD일'
                    defaultDate={imageDates[0] ? new Date(imageDates[0]) : undefined}
                    onChange={handleDateChange}
                    onMouseLeave={datePickerProps?.handleDateMouseLeave}
                    popoverProps={{ position: 'bottom' }}
                    getDayProps={(date: Date) => {
                        const defaultProps: Omit<Partial<DayProps>, 'classNames' | 'styles' | 'vars'> = {
                            disabled: false,
                            onMouseEnter: () => {},
                            selected: false,
                        };

                        return (
                            datePickerProps?.getCustomDayProps(
                                date,
                                datePickerProps.handleDateMouseEnter,
                                dateSelectType,
                            ) ?? defaultProps
                        );
                    }}
                    renderDay={(date) => renderCustomDay(date)}
                />
                {datePickerProps?.isError ? (
                    <p css={errorStyle}>
                        선택하신 날짜 외에도 사진이 있습니다. {isSelectRange && '기간을 다시 확인해 주세요.'}
                    </p>
                ) : (
                    <p css={dateDescriptionStyle}>사진이 있는 날짜는 파란점으로 표시됩니다</p>
                )}
            </section>

            <section>
                <h2 css={titleStyle}>{FORM.TITLE.COUNTRY}</h2>
                <Select
                    placeholder={FORM.TITLE.COUNTRY_DEFAULT}
                    data={countryData}
                    value={country}
                    onChange={(value) => onChangeTripInfo({ ...tripInfo, country: value || '' })}
                    checkIconPosition='right'
                    leftSection={<Globe size={16} />}
                    size='md'
                    radius='md'
                    allowDeselect={false}
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 }, dropdownPadding: 6 }}
                />
            </section>

            <section>
                <h2 css={titleStyle}>{FORM.TITLE.TITLE}</h2>
                <Input
                    value={tripTitle}
                    onChange={(value) => onChangeTripInfo({ ...tripInfo, tripTitle: value })}
                    placeholder='최대 12자까지 입력할 수 있습니다'
                    maxLength={12}
                    leftSection={<Plane size={16} />}
                />
            </section>

            <section>
                <div css={titleStyle}>
                    <h2>{FORM.TITLE.HASHTAG}</h2>
                    <p css={baseDescriptionStyle}>최대 3개까지 선택할 수 있습니다</p>
                </div>
                <div css={hashtagGroup}>
                    {FORM.HASHTAG_MENU.map((tag) => (
                        <button
                            key={tag}
                            css={[buttonBaseStyle, hashtags.includes(tag) ? selectedButtonStyle : defaultButtonStyle]}
                            onClick={() => handleHashtagSelect(tag)}
                        >
                            # {tag}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

const container = css`
    display: flex;
    flex-direction: column;
    gap: 28px;
`;

const titleStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${theme.FONT_SIZES.MD};
    font-weight: bold;
    color: ${theme.COLORS.TEXT.BLACK};
    margin-bottom: 12px;
`;

const hashtagGroup = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const buttonBaseStyle = css`
    padding: 6px 8px;
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
    background-color: ${theme.COLORS.PRIMARY};
    color: ${theme.COLORS.TEXT.WHITE};
`;

const defaultButtonStyle = css`
    background-color: #868e961a;
    color: #868e96;
`;

const baseDescriptionStyle = css`
    font-size: ${theme.FONT_SIZES.SM};
    font-weight: normal;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
`;

const dateDescriptionStyle = css`
    ${baseDescriptionStyle}
    margin-top: 6px;
    margin-left: 4px;
`;

const errorStyle = css`
    margin-top: 6px;
    margin-left: 4px;
    font-size: ${theme.FONT_SIZES.SM};
    color: ${theme.COLORS.TEXT.ERROR};
`;

export default TripInfoForm;
