import { Dispatch, SetStateAction, useEffect } from 'react';

import { css } from '@emotion/react';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { Calendar, Clock } from 'lucide-react';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import { COLORS } from '@/constants/theme';

interface EditDateProps {
    defaultDate: string;
    selectedDate: Date | null;
    setSelectedDate: Dispatch<SetStateAction<Date | null>>;
    isUploading?: boolean;
    uploadImagesWithDate: () => void;
    setIsDateVisible: (isDateVisible: boolean) => void;
}

const EditDate = ({
    defaultDate,
    selectedDate,
    setSelectedDate,
    isUploading,
    uploadImagesWithDate,
    setIsDateVisible,
}: EditDateProps) => {
    useEffect(() => {
        if (!selectedDate) {
            setSelectedDate(new Date(defaultDate));
        }
    }, [defaultDate, selectedDate, setSelectedDate]);

    const handleTimeChange = (hours: number, minutes: number) => {
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            setSelectedDate(newDate);
        }
    };

    return (
        <div css={container}>
            <Header title='날짜 및 시간 수정' isBackButton onBack={() => setIsDateVisible(false)} />
            <main css={mainStyle}>
                <div css={sectionStyle}>
                    <h2 css={sectionTitle}>사진 날짜 수정</h2>
                    <p css={sectionDescription}>이미지가 촬영된 날짜를 수정합니다</p>

                    <div css={inputContainer}>
                        <label css={labelStyle}>날짜</label>
                        <DatePickerInput
                            type='default'
                            value={selectedDate}
                            leftSection={<Calendar size={18} color={COLORS.PRIMARY} />}
                            locale='ko'
                            size='md'
                            radius='md'
                            valueFormat='YYYY년 MM월 DD일'
                            onChange={(value) => setSelectedDate(value)}
                            css={datePickerStyle}
                        />
                    </div>

                    <div css={inputContainer}>
                        <label css={labelStyle}>시간</label>
                        <TimeInput
                            value={
                                selectedDate
                                    ? `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}`
                                    : ''
                            }
                            leftSection={<Clock size={18} color={COLORS.PRIMARY} />}
                            onChange={(event) => {
                                if (event.target.value && selectedDate) {
                                    const [hours, minutes] = event.target.value.split(':').map(Number);
                                    handleTimeChange(hours, minutes);
                                }
                            }}
                            size='md'
                            radius='md'
                            css={datePickerStyle}
                        />
                    </div>
                </div>

                <div css={previewSection}>
                    <h3 css={previewTitle}>변경 후 날짜 및 시간</h3>
                    <p css={datePreview}>
                        {selectedDate
                            ? selectedDate.toLocaleString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                              })
                            : '날짜를 선택해주세요'}
                    </p>
                </div>
            </main>

            <div css={bottomSheet}>
                <Button
                    text='수정하기'
                    onClick={uploadImagesWithDate}
                    isLoading={isUploading}
                    loadingText='위치를 등록하고 있습니다'
                />
            </div>
        </div>
    );
};

const container = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    padding-bottom: 108px;
    gap: 24px;
`;

const sectionStyle = css`
    background-color: ${COLORS.BACKGROUND.WHITE};
    padding: 20px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const sectionTitle = css`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${COLORS.TEXT.BLACK};
`;

const sectionDescription = css`
    font-size: 14px;
    color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
    margin-bottom: 20px;
`;

const inputContainer = css`
    margin-bottom: 16px;
`;

const labelStyle = css`
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.TEXT.DESCRIPTION};
`;

const datePickerStyle = css`
    width: 100%;
`;

const previewSection = css`
    background-color: ${COLORS.BACKGROUND.WHITE};
    padding: 20px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const previewTitle = css`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: ${COLORS.TEXT.BLACK};
`;

const datePreview = css`
    font-size: 16px;
    font-weight: 600;
    color: ${COLORS.PRIMARY};
    padding: 12px;
    border: 1px solid ${COLORS.TEXT.DESCRIPTION_LIGHT}60;
    border-radius: 8px;
    text-align: center;
`;

const bottomSheet = css`
    width: 100vw;
    max-width: 428px;
    position: fixed;
    bottom: 0;
    padding: 16px;
    z-index: 1;
`;

export default EditDate;
