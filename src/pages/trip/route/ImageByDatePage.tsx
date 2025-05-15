import { useEffect, useState, useRef } from 'react';

import { css } from '@emotion/react';
import { ArrowDown, ImageOff } from 'lucide-react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMediaByDate } from '@/domains/media/hooks/queries';
import { useImagesLocationObserver } from '@/domains/media/hooks/useImagesLocationObserver';
import { MediaFile } from '@/domains/media/types';
import { filterValidLocationMediaFile } from '@/domains/media/utils';
import DateMap from '@/domains/trip/components/DateMap';
import DateSelector from '@/domains/trip/components/DateSelector';
import ImageItem from '@/domains/trip/components/ImageItem';
import BackButton from '@/shared/components/common/Button/BackButton';
import Spinner from '@/shared/components/common/Spinner';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/paths';
import { COLORS } from '@/shared/constants/theme';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useScrollHint } from '@/shared/hooks/useScrollHint';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { Location } from '@/shared/types/map';

const ImageByDatePage = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [imageDates, setImageDates] = useState<string[]>([]);
    const [imageLocation, setImageLocation] = useState<Location>();
    const [isAllImageLoad, setIsAllImageLoad] = useState(false);
    const [images, setImages] = useState<MediaFile[]>([]);

    const showToast = useToastStore((state) => state.showToast);

    const { tripKey } = useParams();
    const {
        state: { startDate, endDate, imageDates: dates, defaultLocation },
    } = useLocation();
    console.log(startDate, endDate);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const imageListRef = useRef<HTMLDivElement>(null);
    const loadedImagesCount = useRef<number>(0);

    const { data: result, isLoading } = useMediaByDate(tripKey!, currentDate);
    const { isMapScriptLoaded, isMapScriptLoadError } = useMapControl(ZOOM_SCALE.DEFAULT.IMAGE_BY_DATE, DEFAULT_CENTER);
    const { isHintOverlayVisible, isFirstUser } = useScrollHint(imageListRef, isMapScriptLoaded, isAllImageLoad);

    useEffect(() => {
        if (!dates?.length) {
            return;
        }
        const formattedDates = dates.filter((date: string) => date > startDate && date < endDate);

        formattedDates.push(endDate);
        formattedDates.unshift(startDate);

        setImageDates(formattedDates);
        setCurrentDate(formattedDates[0]);
    }, []);

    useEffect(() => {
        if (currentDate) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('date', currentDate);
            setSearchParams(newSearchParams);
        }
    }, [searchParams, currentDate]);

    useEffect(() => {
        if (result) {
            const images = result.success ? result.data : [];
            setImages(filterValidLocationMediaFile(images));
            if (images.length === 0) {
                setIsAllImageLoad(true);
            }
        }
    }, [result]);

    const imageRefs = useImagesLocationObserver(
        result && 'data' in result && Array.isArray(result.data) ? result.data : [],
        setImageLocation,
    );

    const handleImageLoad = () => {
        loadedImagesCount.current += 1;
        if (loadedImagesCount.current === images.length) {
            setIsAllImageLoad(true);
        }
    };

    if (isMapScriptLoadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(-1);
    }
    if (!isMapScriptLoaded || isLoading) {
        return <Spinner />;
    }

    if (!result) return <div>데이터를 불러올 수 없습니다.</div>;
    const emptyImage = images.length !== 0;

    return (
        <div css={container}>
            {(isLoading || !isAllImageLoad) && <Spinner text='사진 불러오는 중...' />}

            <BackButton onClick={() => navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey as string)}`)} />

            <DateMap imageLocation={imageLocation ? imageLocation : defaultLocation} />
            <DateSelector
                firstImageDate={currentDate || startDate}
                imageDates={imageDates}
                startDate={startDate}
                endDate={endDate}
                onDateSelect={(date: string) => setCurrentDate(date)}
            />

            {emptyImage ? (
                <main ref={imageListRef} css={imageListStyle}>
                    {images.map((image, index) => (
                        <ImageItem
                            key={image.mediaFileId}
                            reference={(element) => (imageRefs.current[index] = element)}
                            image={image}
                            index={index}
                            onImageLoad={handleImageLoad}
                        />
                    ))}
                </main>
            ) : (
                <div css={emptyImageList}>
                    <div css={emptyIcon}>
                        <ImageOff color='white' />
                    </div>
                    <h3 css={emptyImageListHeading}>등록된 사진이 없어요</h3>
                    <p css={emptyImageListDescription}>{`티켓 속 사진 관리에서\n새로운 사진을 등록해주세요`}</p>
                </div>
            )}

            {isFirstUser && (
                <div css={scrollHintOverlayStyle(isHintOverlayVisible)}>
                    <div css={scrollHintContentStyle}>
                        <p css={scrollHintText}>아래로 스크롤하세요</p>
                        <ArrowDown size={24} color={theme.COLORS.TEXT.WHITE} />
                    </div>
                </div>
            )}
        </div>
    );
};

const container = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
    background-color: #f9fafb;
    position: relative;
`;

const imageListStyle = css`
    max-width: 430px;
    flex: 1;
    overflow-y: auto;
    position: relative;
`;

const emptyImageList = css`
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const emptyImageListHeading = css`
    margin-top: 18px;
    color: #303038;
    font-size: 18px;
    font-weight: bold;
`;

const emptyImageListDescription = css`
    margin-top: 8px;
    color: #767678;
    font-size: 15px;
    line-height: 21px;
    text-align: center;
    white-space: pre-line;
`;

const emptyIcon = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
`;

const scrollHintOverlayStyle = (isVisible: boolean) => css`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: end;
    opacity: ${isVisible ? 1 : 0};
    visibility: ${isVisible ? 'visible' : 'hidden'};
    transition:
        opacity 0.3s ease-in-out,
        visibility 0.3s ease-in-out;
    z-index: 1000;
    pointer-events: ${isVisible ? 'auto' : 'none'};
    padding: 16px;
`;

const scrollHintContentStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
`;

const scrollHintText = css`
    color: ${theme.COLORS.TEXT.WHITE};
    text-align: center;
    margin: 0;
`;

export default ImageByDatePage;
