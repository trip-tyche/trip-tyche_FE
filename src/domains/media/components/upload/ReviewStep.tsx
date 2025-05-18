import { css } from '@emotion/react';
import { AlertCircle, Check, Image, MapPin, Calendar, Map as MapIcon } from 'lucide-react';

import ImageExtractionSummary from '@/domains/media/components/upload/ImageExtractionSummary';
import { ImageFile, ImagesFiles } from '@/domains/media/types';
import { formatHyphenToDot, formatKoreanDate, formatToKorean } from '@/libs/utils/date';
import AlertBox from '@/shared/components/common/AlertBox';
import Avatar from '@/shared/components/common/Avatar';
import Button from '@/shared/components/common/Button';
import { COLORS } from '@/shared/constants/style';

interface ReviewStepProps {
    images: ImagesFiles;
    imageDates: string[] | null;
    location: { image: ImageFile; imageName: string; address: string }[];
}

const ReviewStep = ({ images, imageDates, location }: ReviewStepProps) => {
    const extractionResults = {
        totalPhotos: 33,
        photosWithLocation: 28,
        photosWithDate: 31,
        earliestDate: '2023.7.19',
        latestDate: '2023.7.25',
        locations: [
            { name: '노르웨이, 오슬로', count: 12 },
            { name: '노르웨이, 베르겐', count: 9 },
            { name: '노르웨이, 트롬쇠', count: 7 },
        ],
    };

    const getPreview = () => {
        return location
            .map((loc) => {
                const url = URL.createObjectURL(loc.image.image);

                if (!loc.image.recordDate && !loc.image.location) {
                    return null;
                }

                return (
                    <div
                        key={loc.imageName}
                        css={css`
                            background-color: white;
                            border-radius: 0.5rem;
                            border: 1px solid #e5e7eb;
                            overflow: hidden;
                        `}
                    >
                        <img
                            src={url}
                            alt='여행 사진'
                            css={css`
                                width: 100%;
                                height: 6rem;
                                object-fit: cover;
                                background-color: black;
                            `}
                        />
                        <div
                            css={css`
                                padding: 0.5rem;
                            `}
                        >
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                `}
                            >
                                <MapPin
                                    css={css`
                                        width: 0.75rem;
                                        height: 0.75rem;
                                        margin-right: 0.25rem;
                                        flex-shrink: 0;
                                    `}
                                />
                                <p
                                    css={css`
                                        font-size: 0.75rem;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        color: ${!loc.image.location ? '#ef4444' : '#374151'};
                                    `}
                                >
                                    {loc.address || '위치 정보 없음'}
                                </p>
                            </div>
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                    margin-top: 0.25rem;
                                `}
                            >
                                <Calendar
                                    css={css`
                                        width: 0.75rem;
                                        height: 0.75rem;
                                        margin-right: 0.25rem;
                                        flex-shrink: 0;
                                    `}
                                />
                                <p
                                    css={css`
                                        font-size: 0.75rem;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        color: ${!loc.image.recordDate ? '#ef4444' : '#374151'};
                                    `}
                                >
                                    {loc.image.recordDate ? formatKoreanDate(loc.image.recordDate) : '날짜 정보 없음'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })
            .filter((loc) => loc !== null);
    };

    const getMainPlace = () => {
        const map = new Map();

        location.forEach((loc) => {
            const { address } = loc;

            if (address) {
                if (map.has(address)) {
                    const prev = map.get(address);
                    map.set(address, prev + 1);
                } else {
                    map.set(address, 1);
                }
            }
        });

        return [...map].map((loc) => {
            const format = loc[0].split(' ');
            return { place: `${format[0]}, ${format[1]}`, count: loc[1] };
        });
    };

    const totalImagesCount = images?.totalImages.length || 0;
    const imagesWithoutLocation = images?.imagesWithoutLocation.length || 0;
    const imagesWithoutDateCount = images?.imagesWithoutDate.length || 0;

    const startDate = imageDates?.length ? formatHyphenToDot(imageDates[0]) : '';
    const endDate = imageDates?.length ? formatHyphenToDot(imageDates[imageDates.length - 1]) : '';
    const isSingleDate = startDate === endDate;
    const estimatedTripPeriod = isSingleDate ? `${startDate} (하루)` : `${startDate} ~ ${endDate}`;

    return (
        <div css={container}>
            <AlertBox
                theme='success'
                title='사진 처리 완료'
                description={`${totalImagesCount}장의 사진이 성공적으로 처리되었습니다`}
                icon={<Check size={16} />}
            />
            <div css={uploadSummary}>
                <div css={summaryHeader}>
                    <Avatar size='sm' shape='circle' icon={<Image size={20} color={COLORS.PRIMARY} />} />
                    <div
                        css={css`
                            margin-left: 8px;
                        `}
                    >
                        <h3 css={headerTitle}>처리된 사진</h3>
                        <p css={headerImageCount}>총 {totalImagesCount}장</p>
                    </div>
                </div>

                <div css={extractionSummary}>
                    <ImageExtractionSummary
                        title='위치 정보'
                        icon={<MapPin size={16} color={COLORS.ICON.DEFAULT} />}
                        extractSuccessCount={totalImagesCount - imagesWithoutLocation}
                        extractFailCount={imagesWithoutLocation}
                    />
                    <ImageExtractionSummary
                        title='날짜 정보'
                        icon={<Calendar size={16} color={COLORS.ICON.DEFAULT} />}
                        extractSuccessCount={totalImagesCount - imagesWithoutDateCount}
                        extractFailCount={imagesWithoutDateCount}
                    />
                </div>

                <div
                    css={css`
                        margin-bottom: 8px;
                        font-size: 14px;
                    `}
                >
                    <div
                        css={css`
                            margin-bottom: 10px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        `}
                    >
                        <Calendar size={16} color={COLORS.ICON.DEFAULT} />
                        <p
                            css={css`
                                font-weight: 500;
                            `}
                        >
                            추정 여행 기간
                        </p>
                    </div>
                    <p>{estimatedTripPeriod}</p>
                </div>

                <div
                    css={css`
                        margin-bottom: 8px;
                        font-size: 14px;
                    `}
                >
                    <div
                        css={css`
                            margin-bottom: 10px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        `}
                    >
                        <MapIcon size={16} color={COLORS.ICON.DEFAULT} />
                        <p
                            css={css`
                                font-weight: 500;
                            `}
                        >
                            주요 방문 장소
                        </p>
                    </div>
                    <ul>
                        {getMainPlace().map((location) => (
                            <li
                                key={location.place}
                                css={css`
                                    list-style: none;
                                    margin-bottom: 6px;
                                    &:last-child {
                                        margin-bottom: 0;
                                    }
                                `}
                            >
                                {location.place} ({location.count}장)
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 사진 샘플 */}
            <div
                css={css`
                    margin-bottom: 1.5rem;
                `}
            >
                <h3
                    css={css`
                        font-weight: 500;
                        margin-bottom: 0.75rem;
                    `}
                >
                    사진 미리보기
                </h3>
                <div
                    css={css`
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.75rem;
                    `}
                >
                    {getPreview()}
                    {/* {getPreview().slice(0, 4)} */}
                </div>
            </div>

            <AlertBox
                theme='warning'
                title='일부 사진에 정보가 누락되었습니다'
                description='위치 정보가 없는 사진 5장, 날짜 정보가 없는 사진 2장이 있습니다. 걱정 마세요! 여행을 등록한 후 사진 관리 화면에서 직접 정보를 추가할 수 있습니다.'
                icon={<AlertCircle size={20} color='#ca8a04' />}
            />

            <div
                css={css`
                    margin-top: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                `}
            >
                <Button text='여행 정보 입력하기' />
            </div>
        </div>
    );
};

const container = css`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const uploadSummary = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${COLORS.BORDER};
`;

const summaryHeader = css`
    display: flex;
    align-items: center;
`;

const headerTitle = css`
    margin-bottom: 4px;
    font-weight: 500;
`;
const headerImageCount = css`
    font-size: 14px;
    color: #4b5563;
`;

const extractionSummary = css`
    width: 100%;
    display: flex;
    gap: 16px;
    margin-bottom: 1rem;
`;

export default ReviewStep;
