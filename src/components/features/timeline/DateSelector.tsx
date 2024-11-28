import { css } from '@emotion/react';
import { ChevronDown } from 'lucide-react';

import theme from '@/styles/theme';
import { formatDateToKorean, getDayNumber } from '@/utils/date';

interface DateSelectorProps {
    currentDate: string;
    datesWithImages: string[];
    startDate: string;
    onDateSelect: (date: string) => void;
    onArrowButtonClick: () => void;
}

const DateSelector = ({
    currentDate,
    datesWithImages,
    startDate,
    onDateSelect,
    onArrowButtonClick,
}: DateSelectorProps) => {
    const generateDayList = () => {
        if (!startDate || !datesWithImages.length) return [];

        return datesWithImages.map((date) => {
            const dayNumber = getDayNumber(date, startDate);
            return { date, dayNumber };
        });
    };

    return (
        <section css={dateSelectorStyle}>
            <div css={buttonGroup}>
                {generateDayList().map(({ date, dayNumber }) => (
                    <button key={date} css={dayButtonStyle(currentDate === date)} onClick={() => onDateSelect(date)}>
                        <h3>{dayNumber}</h3>
                        <p>{formatDateToKorean(date)}</p>
                    </button>
                ))}
            </div>
            <button css={arrowButtonStyle} onClick={onArrowButtonClick}>
                <ChevronDown size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
            </button>
        </section>
    );
};

const dateSelectorStyle = css`
    display: flex;
    background-color: ${theme.colors.white};
    height: ${theme.heights.tall_54};
    padding: 8px 20px 8px 8px;
`;

const buttonGroup = css`
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
    flex-grow: 1;
`;

const dayButtonStyle = (isSelected: boolean) => css`
    background: none;
    border: none;
    padding: 4px 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    h3 {
        font-weight: bold;
        color: ${isSelected ? theme.colors.primary : theme.colors.darkGray};
    }

    p {
        font-size: ${theme.fontSizes.xsmall_10};
        color: ${theme.colors.descriptionText};
    }
`;

const arrowButtonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
`;

export default DateSelector;
