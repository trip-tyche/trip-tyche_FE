import { Dispatch, SetStateAction, useState, useRef } from 'react';

import { TextInput, Select, Button, Stack, Box, Group, Text } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { IconPlane, IconCalendar, IconWorld } from '@tabler/icons-react';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import { COUNTRY_OPTIONS, HASHTAG_MENU, NEW_COUNTRY } from '@/constants/trip';
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
    setStartDate,
    setEndDate,
    hashtags,
    setHashtags,
}: TripFormProps): JSX.Element => {
    const [dateRange, setDateRange] = useState<[DateValue, DateValue]>([null, null]);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const isSelecting = useRef(false);

    const countryData = COUNTRY_OPTIONS.map((country) => ({
        value: `${country.emoji} ${country.name}`,
        label: `${country.emoji} ${country.name}`,
    }));

    const toggleHashtag = (tag: string) => {
        setHashtags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    const handleDateChange = (value: [DateValue, DateValue]) => {
        setDateRange(value);
        if (value[0]) {
            const startDateString = dayjs(value[0]).format('YYYY-MM-DD');
            setStartDate(startDateString);
            isSelecting.current = true;
        }
        if (value[1]) {
            const endDateString = dayjs(value[1]).format('YYYY-MM-DD');
            setEndDate(endDateString);
            isSelecting.current = false;
        }
    };

    const handleDateMouseEnter = (date: Date) => {
        if (isSelecting.current) {
            setHoveredDate(date);
        }
    };

    const handleDateMouseLeave = () => {
        setHoveredDate(null);
    };

    const isInRange = (date: Date) => {
        if (!dateRange[0] || !hoveredDate) return false;
        const start = dateRange[0].getTime();
        const end = hoveredDate.getTime();
        const current = date.getTime();
        return (current >= start && current <= end) || (current <= start && current >= end);
    };

    return (
        <Stack gap='lg'>
            <Box>
                <Text size='xs' fw={600} mb={8}>
                    {NEW_COUNTRY.TITLE}
                </Text>
                <TextInput
                    placeholder={NEW_COUNTRY.TITLE_PLACEHOLDER}
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    leftSection={<IconPlane size={16} />}
                    size='xs'
                    required={true}
                />
            </Box>

            <Box>
                <Text size='xs' fw={600} mb={8}>
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
                    size='xs'
                    required={true}
                />
            </Box>

            <Box>
                <Text size='xs' fw={600} mb={8}>
                    {NEW_COUNTRY.DATE}
                </Text>
                <DatePickerInput
                    type='range'
                    placeholder='여행 시작일과 종료일을 선택하세요'
                    required={true}
                    value={dateRange}
                    onChange={handleDateChange}
                    onMouseLeave={handleDateMouseLeave}
                    leftSection={<IconCalendar size={16} />}
                    locale='ko'
                    size='xs'
                    valueFormat='YYYY년 MM월 DD일'
                    styles={(theme) => ({
                        day: {
                            '&[data-selected]': {
                                backgroundColor: theme.colors.blue[6],
                                color: theme.white,
                            },
                            '&[data-in-range]': {
                                backgroundColor: theme.colors.blue[0],
                                color: theme.colors.blue[6],
                            },
                            '&[data-first-in-range]': {
                                backgroundColor: theme.colors.blue[6],
                                color: theme.white,
                            },
                            '&[data-last-in-range]': {
                                backgroundColor: theme.colors.blue[6],
                                color: theme.white,
                            },
                        },
                    })}
                    getDayProps={(date) => ({
                        onMouseEnter: () => handleDateMouseEnter(date),
                        style:
                            dateRange[0] && date.getTime() === dateRange[0].getTime()
                                ? { backgroundColor: 'rgb(51, 102, 255)', color: 'white' }
                                : isInRange(date)
                                  ? { backgroundColor: 'rgba(51, 102, 255, 0.1)' }
                                  : {},
                    })}
                />
            </Box>

            <Box>
                <Text size='xs' fw={600} mb={12}>
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

export default TripForm;
