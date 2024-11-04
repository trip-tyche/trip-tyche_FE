import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { TextInput, Select, Button, Stack, Box, Group, Text } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { IconPlane, IconCalendar, IconWorld } from '@tabler/icons-react';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import { COUNTRY_OPTIONS, HASHTAG_MENU, NEW_COUNTRY } from '@/constants/trip';
import theme from '@/styles/theme';
import { TripFormProps } from '@/types/trip';
import { formatDateToKoreanYear } from '@/utils/date';

const TripForm = ({
    tripTitle,
    imageDates = [],
    country,
    hashtags,
    setTripTitle,
    setCountry,
    setStartDate,
    setEndDate,
    setHashtags,
}: TripFormProps) => {
    // const defaultStartDate = imageDates[0] ? new Date(imageDates[0]) : null;
    // const defaultEndDate = imageDates[imageDates.length - 1] ? new Date(imageDates[imageDates.length - 1]) : null;
    const defaultStartDate = imageDates[0] || null;
    const defaultEndDate = imageDates[imageDates.length - 1] || null;

    // dateRange의 초기값으로 설정
    const [dateRange, setDateRange] = useState<[DateValue, DateValue]>([null, null]);
    const [isInitialized, setIsInitialized] = useState(true); // 초기에는 true로 설정
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isError, setIsError] = useState(false);

    // useEffect(() => {
    //     if (defaultStartDate && defaultEndDate) {
    //         handleDateChange([defaultStartDate, defaultEndDate]);
    //     }
    // }, []);

    const countryData = COUNTRY_OPTIONS.map((country) => ({
        value: `${country.emoji} ${country.name}`,
        label: `${country.emoji} ${country.name}`,
    }));

    const toggleHashtag = (tag: string) => {
        setHashtags((prev: string[]) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    const handleDateChange = (value: [DateValue, DateValue]) => {
        setDateRange(value);

        // 처음으로 날짜를 선택할 때 초기화 상태 해제
        if (isInitialized && value[0]) {
            setIsInitialized(false);
        }

        // 초기화 상태가 해제된 후에만 선택 로직 실행
        if (!isInitialized) {
            if (value[0] && !value[1]) {
                const startDateString = dayjs(value[0]).format('YYYY-MM-DD');
                setStartDate(startDateString);
                setIsSelectMode(true);
                setIsError(false);
            } else if (value[0] && value[1]) {
                const date1 = dayjs(value[0]);
                const date2 = dayjs(value[1]);

                const startDateString = date1.isBefore(date2) ? date1.format('YYYY-MM-DD') : date2.format('YYYY-MM-DD');
                const endDateString = date1.isBefore(date2) ? date2.format('YYYY-MM-DD') : date1.format('YYYY-MM-DD');

                setStartDate(startDateString);
                setEndDate(endDateString);
                setIsSelectMode(false);

                const hasOutsideImages = imageDates.some((imageDate) => {
                    const date = dayjs(imageDate);
                    return date.isBefore(startDateString) || date.isAfter(endDateString);
                });

                setIsError(hasOutsideImages);
            }
        }
    };

    const handleDateMouseEnter = (date: Date) => {
        if (isInitialized) return; // 초기화 상태에서는 호버 효과 없음
        if (isStartOrEndDate(date)) {
            return;
        }
        if (isSelectMode) {
            setHoveredDate(date);
        }
    };

    const handleDateMouseLeave = () => {
        if (isSelectMode) {
            setHoveredDate(null);
        }
    };

    const isInRange = (date: Date) => {
        if (!dateRange[0]) return false;

        // 시작일 또는 종료일인 경우 범위에서 제외
        if (dateRange[0] && date.getTime() === dateRange[0].getTime()) return false;
        if (dateRange[1] && date.getTime() === dateRange[1].getTime()) return false;

        // 선택 모드일 때는 첫 선택과 호버 사이의 범위
        if (isSelectMode && hoveredDate) {
            const start = dateRange[0].getTime();
            const end = hoveredDate.getTime();
            const current = date.getTime();
            return (current >= start && current <= end) || (current <= start && current >= end);
        }

        // 선택 모드가 아닐 때는 선택된 두 날짜 사이의 범위
        if (!isSelectMode && dateRange[1]) {
            const start = dateRange[0].getTime();
            const end = dateRange[1].getTime();
            const current = date.getTime();
            return current > start && current < end;
        }

        return false;
    };

    const isStartOrEndDate = (date: Date) =>
        // dateRange뿐만 아니라 defaultStartDate, defaultEndDate도 체크
        (dateRange[0] && date.getTime() === dateRange[0].getTime()) ||
        (dateRange[1] && date.getTime() === dateRange[1].getTime());
    // (defaultStartDate && date.getTime() === defaultStartDate.getTime()) ||
    // (defaultEndDate && date.getTime() === defaultEndDate.getTime());

    return (
        <Stack gap='lg'>
            <Box>
                <div css={dayStyle}>
                    <Text size='sm' fw={600}>
                        {NEW_COUNTRY.DATE}
                    </Text>
                    <p css={dayTextStyle}>사진이 있는 날짜는 파란점으로 표시됩니다.</p>
                </div>
                <DatePickerInput
                    type='range'
                    placeholder={`${formatDateToKoreanYear(defaultStartDate)} ~ ${formatDateToKoreanYear(defaultEndDate)}`}
                    required={true}
                    value={dateRange}
                    defaultDate={imageDates[0] ? new Date(imageDates[0]) : undefined} // 이 부분 추가
                    onChange={handleDateChange}
                    onMouseLeave={handleDateMouseLeave}
                    leftSection={<IconCalendar size={16} />}
                    locale='ko'
                    size='md'
                    valueFormat='YYYY년 MM월 DD일'
                    popoverProps={{
                        // width: 'target',
                        position: 'bottom',
                    }}
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
            </Box>

            <Box>
                <Text size='sm' fw={600} mb={8}>
                    {NEW_COUNTRY.COUNTRY}
                </Text>
                <Select
                    placeholder={NEW_COUNTRY.COUNTRY_DEFAULT}
                    data={countryData}
                    value={country}
                    onChange={(value) => setCountry(value || '')}
                    searchable={false}
                    nothingFoundMessage='옵션이 없습니다'
                    leftSection={<IconWorld size={16} />}
                    size='md'
                    required={true}
                />
            </Box>

            <Box>
                <Text size='sm' fw={600} mb={8}>
                    {NEW_COUNTRY.TITLE}
                </Text>
                <TextInput
                    placeholder={NEW_COUNTRY.TITLE_PLACEHOLDER}
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    leftSection={<IconPlane size={16} />}
                    size='md'
                    required={true}
                />
            </Box>

            <Box>
                <Text size='sm' fw={600} mb={12}>
                    해시태그
                </Text>
                <Group gap='sm'>
                    {HASHTAG_MENU.map((tag) => (
                        <Button
                            key={tag}
                            variant={hashtags.includes(tag) ? 'filled' : 'light'}
                            color={hashtags.includes(tag) ? 'blue' : 'gray'}
                            onClick={() => toggleHashtag(tag)}
                            size='xs'
                            px='sm'
                        >
                            {tag}
                        </Button>
                    ))}
                </Group>
            </Box>
        </Stack>
    );
};

const dayStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

const dayTextStyle = css`
    font-size: ${theme.fontSizes.small_12};
    color: ${theme.colors.descriptionText};
`;

const errorStyle = css`
    margin-top: 6px;
    margin-left: 4px;
    font-size: ${theme.fontSizes.small_12};
    color: #ff0101;
`;

export default TripForm;
