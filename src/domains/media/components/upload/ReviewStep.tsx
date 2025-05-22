import { css } from '@emotion/react';
import { AlertCircle, Check, Image, MapPin, Calendar, Map as MapIcon } from 'lucide-react';

import ImageCard from '@/domains/media/components/upload/ImageCard';
import ImageExtractionSummary from '@/domains/media/components/upload/ImageExtractionSummary';
import { ImageFileWithAddress, MediaFileCategories } from '@/domains/media/types';
import AlertBox from '@/shared/components/common/AlertBox';
import Avatar from '@/shared/components/common/Avatar';
import { COLORS } from '@/shared/constants/style';

interface ReviewStepProps {
    imageCategories: MediaFileCategories;
    tripPeriod: string[];
    imagesWithAddress: ImageFileWithAddress[];
}

const ReviewStep = ({ imageCategories, tripPeriod, imagesWithAddress }: ReviewStepProps) => {
    const getVisitedPlace = (imagesWithAddress: ImageFileWithAddress[]) => {
        const map = new Map();
        imagesWithAddress.forEach((image) => {
            const { address } = image;
            if (address) {
                if (map.has(address)) {
                    const count = map.get(address);
                    map.set(address, count + 1);
                } else {
                    map.set(address, 1);
                }
            }
        });

        return Array.from(map).map((image) => {
            return { place: `${image[0]}`, count: image[1] };
        });
    };

    const getImagePreviewComponent = () =>
        imagesWithAddress
            .filter((image) => image.address || image.recordDate)
            .slice(0, 4)
            .map((image) => <ImageCard key={image.imageUrl} image={image} />);

    const [startDate, endDate] = tripPeriod;
    const isSingleDate = startDate === endDate;
    const estimatedTripPeriod =
        startDate && endDate ? (isSingleDate ? `${startDate} (하루)` : `${startDate} ~ ${endDate}`) : null;
    const visitedPlace = imagesWithAddress.length > 0 ? getVisitedPlace(imagesWithAddress) : null;
    const hasInvalidImage = !!imageCategories.withoutLocation.count || !!imageCategories.withoutDate.count;

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
                        extractSuccessCount={imageCategories.withAll.count - imageCategories.withoutLocation.count}
                        extractFailCount={imageCategories.withoutLocation.count}
                    />
                    <ImageExtractionSummary
                        title='날짜 정보'
                        icon={<Calendar size={16} color={COLORS.ICON.DEFAULT} />}
                        extractSuccessCount={imageCategories.withAll.count - imageCategories.withoutDate.count}
                        extractFailCount={imageCategories.withoutDate.count}
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

                {visitedPlace && (
                    <div css={periodAndVisitedPlaceContainer}>
                        <div css={periodAndVisitedPlaceHeader}>
                            <MapIcon size={16} color={COLORS.ICON.DEFAULT} />
                            <p css={periodAndVisitedPlaceTitle}>주요 방문 장소</p>
                        </div>
                        <ul>
                            {visitedPlace.map((location) => (
                                <li key={location.place} css={placeListStyle}>
                                    {location.place} ({location.count}장)
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {getImagePreviewComponent() && (
                <div>
                    <h3 css={imagePreviewTitle}>등록된 사진 미리보기</h3>
                    <div css={imagePreviewStyle}>{getImagePreviewComponent()}</div>
                </div>
            )}

            {hasInvalidImage && (
                <AlertBox
                    theme='warning'
                    title='일부 사진에 정보가 누락되었습니다'
                    description={`위치 정보가 없는 사진 ${imageCategories.withoutLocation.count}장, 날짜 정보가 없는 사진 ${imageCategories.withoutDate.count}장이 있습니다. 걱정 마세요! 여행을 등록한 후 사진 관리 화면에서 직접 정보를 추가할 수 있습니다.`}
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

const imagePreviewTitle = css`
    font-weight: 500;
    margin-bottom: 16px;
`;

const imagePreviewStyle = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
`;

const placeListStyle = css`
    list-style: none;
    margin-bottom: 6px;
    &:last-child {
        margin-bottom: 0;
    }
`;

export default ReviewStep;
