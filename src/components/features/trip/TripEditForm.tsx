import React from 'react';

import { css } from '@emotion/react';
import { TextInput, Select, Button, Stack, Box, Group, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconPlane, IconCalendar, IconWorld } from '@tabler/icons-react';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import { COUNTRY_OPTIONS, HASHTAG_MENU, TRIP_FORM } from '@/constants/trip';
import theme from '@/styles/theme';
import { TripInfo } from '@/types/trip';

interface TripEditFormProps {
    tripData: TripInfo;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleHashtagToggle: (tag: string) => void;
}

const TripEditForm = ({ tripData, handleInputChange, handleHashtagToggle }: TripEditFormProps): JSX.Element => {
    const { country, tripTitle } = tripData;

    const countryData = COUNTRY_OPTIONS.map((country) => ({
        value: `${country.value}`,
        label: `${country.emoji} ${country.nameKo}`,
    }));

    // const handleDateChange = (dates: [Date | null, Date | null]) => {
    //     const [start, end] = dates;
    //     if (start) {
    //         handleInputChange({
    //             target: { name: 'startDate', value: dayjs(start).format('YYYY-MM-DD') },
    //         } as React.ChangeEvent<HTMLInputElement>);
    //     }
    //     if (end) {
    //         handleInputChange({
    //             target: { name: 'endDate', value: dayjs(end).format('YYYY-MM-DD') },
    //         } as React.ChangeEvent<HTMLInputElement>);
    //     }
    // };

    return (
        <Stack gap='lg'>
            <Box>
                <div css={dayStyle}>
                    <Text size='sm' fw={600}>
                        {TRIP_FORM.DATE}
                    </Text>
                    <p css={dayTextStyle}>여행 기간은 수정이 불가합니다.</p>
                </div>
                <DatePickerInput
                    type='range'
                    placeholder='여행 시작일과 종료일을 선택하세요'
                    value={[
                        tripData.startDate ? dayjs(tripData.startDate).toDate() : null,
                        tripData.endDate ? dayjs(tripData.endDate).toDate() : null,
                    ]}
                    leftSection={<IconCalendar size={16} />}
                    locale='ko'
                    size='md'
                    valueFormat='YYYY년 MM월 DD일'
                    readOnly={true}
                    // disabled={true}
                />
            </Box>

            <Box>
                <Text size='sm' fw={600} mb={8}>
                    {TRIP_FORM.COUNTRY}
                </Text>
                <Select
                    placeholder={TRIP_FORM.COUNTRY_DEFAULT}
                    data={countryData}
                    value={country}
                    onChange={(value) =>
                        handleInputChange({
                            target: { name: 'country', value: value || '' },
                        } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    searchable={false}
                    nothingFoundMessage='옵션이 없습니다'
                    leftSection={<IconWorld size={16} />}
                    size='md'
                    required={true}
                />
            </Box>

            <Box>
                <Text size='sm' fw={600} mb={8}>
                    {TRIP_FORM.TITLE}
                </Text>
                <TextInput
                    name='tripTitle'
                    placeholder={TRIP_FORM.TITLE_PLACEHOLDER}
                    value={tripTitle}
                    onChange={handleInputChange}
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
                            variant={tripData.hashtags.includes(tag) ? 'filled' : 'light'}
                            color={tripData.hashtags.includes(tag) ? 'blue' : 'gray'}
                            onClick={() => handleHashtagToggle(tag)}
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

export default TripEditForm;
