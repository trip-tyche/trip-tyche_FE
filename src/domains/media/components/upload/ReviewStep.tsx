import { css } from '@emotion/react';
import { AlertCircle, Check, Image, MapPin, Calendar, Map as MapIcon } from 'lucide-react';

import ImageExtractionSummary from '@/domains/media/components/upload/ImageExtractionSummary';
import { MediaFileCategories } from '@/domains/media/types';
import AlertBox from '@/shared/components/common/AlertBox';
import Avatar from '@/shared/components/common/Avatar';
import { COLORS } from '@/shared/constants/style';
import { useAddressAggregation } from '@/shared/hooks/useAddressAggregation';
import { Location } from '@/shared/types/map';

interface ReviewStepProps {
    imageCategories: MediaFileCategories;
    tripPeriod: string[];
    locations: Location[];
}

const ReviewStep = ({ imageCategories, tripPeriod, locations }: ReviewStepProps) => {
    const { addresses } = useAddressAggregation(locations);

    const [startDate, endDate] = tripPeriod;
    const isSingleDate = startDate === endDate;
    const estimatedTripPeriod =
        startDate && endDate ? (isSingleDate ? `${startDate} (하루)` : `${startDate} ~ ${endDate}`) : null;

    const imagesWithoutLocationCount = imageCategories.withoutLocation.count;
    const imagesWithoutDateCount = imageCategories.withoutDate.count;
    const hasInvalidImage = !!imagesWithoutLocationCount || !!imagesWithoutDateCount;

    const guideOfWithoutImage = `${imagesWithoutLocationCount ? `위치 정보가 없는 사진 ${imagesWithoutLocationCount}장` : ''}${imagesWithoutLocationCount && imagesWithoutDateCount ? `, ` : ''}${imagesWithoutDateCount ? `날짜 정보가 없는 사진 ${imagesWithoutDateCount}장` : ''}이 있습니다. 걱정 마세요! 여행을 등록한 후 사진 관리 화면에서 직접 정보를 추가할 수 있습니다.`;

    return (
        <div css={container}>
            <AlertBox
                theme='success'
                title='사진 처리 완료'
                description={`${imageCategories.withAll.count}장의 사진이 성공적으로 처리되었습니다`}
                icon={<Check size={16} />}
            />
            <div css={uploadSummary}>
                <div css={summaryHeader}>
                    <Avatar size='sm' shape='circle' icon={<Image size={20} color={COLORS.PRIMARY} />} />
                    <div css={headerContent}>
                        <h3 css={headerTitle}>처리된 사진</h3>
                        <p css={headerImageCount}>총 {imageCategories.withAll.count}장</p>
                    </div>
                </div>

                <div css={extractionSummary}>
                    <ImageExtractionSummary
                        title='위치 정보'
                        icon={<MapPin size={16} color={COLORS.ICON.DEFAULT} />}
                        extractSuccessCount={imageCategories.withAll.count - imagesWithoutLocationCount}
                        extractFailCount={imagesWithoutLocationCount}
                    />
                    <ImageExtractionSummary
                        title='날짜 정보'
                        icon={<Calendar size={16} color={COLORS.ICON.DEFAULT} />}
                        extractSuccessCount={imageCategories.withAll.count - imagesWithoutDateCount}
                        extractFailCount={imagesWithoutDateCount}
                    />
                </div>

                {estimatedTripPeriod && (
                    <div css={periodAndVisitedPlaceContainer}>
                        <div css={periodAndVisitedPlaceHeader}>
                            <Calendar size={16} color={COLORS.ICON.DEFAULT} />
                            <p css={periodAndVisitedPlaceTitle}>추정 여행 기간</p>
                        </div>
                        <p>{estimatedTripPeriod}</p>
                    </div>
                )}

                {addresses.length > 0 && (
                    <div css={periodAndVisitedPlaceContainer}>
                        <div css={periodAndVisitedPlaceHeader}>
                            <MapIcon size={16} color={COLORS.ICON.DEFAULT} />
                            <p css={periodAndVisitedPlaceTitle}>주요 방문 장소</p>
                        </div>
                        <ul>
                            {addresses.map((address) => (
                                <li key={address.place} css={placeListStyle}>
                                    {address.place} ({address.count}장)
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {hasInvalidImage && (
                <AlertBox
                    theme='warning'
                    title='일부 사진에 정보가 누락되었습니다'
                    description={guideOfWithoutImage}
                    icon={<AlertCircle size={20} color='#ca8a04' />}
                />
            )}
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
    gap: 24px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${COLORS.BORDER};
`;

const summaryHeader = css`
    display: flex;
    align-items: center;
`;

const headerContent = css`
    margin-left: 8px;
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
`;

const periodAndVisitedPlaceContainer = css`
    margin-bottom: 8px;
    font-size: 14px;
`;

const periodAndVisitedPlaceHeader = css`
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const periodAndVisitedPlaceTitle = css`
    font-weight: 500;
`;

const placeListStyle = css`
    list-style: none;
    margin-bottom: 6px;
    &:last-child {
        margin-bottom: 0;
    }
`;

export default ReviewStep;
