import { useEffect, useState, useRef } from 'react';

import { css } from '@emotion/react';
import { ArrowDown } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMediaByDate } from '@/domains/media/hooks/queries';
import { useImagesLocationObserver } from '@/domains/media/hooks/useImagesLocationObserver';
import DateMap from '@/domains/trip/components/DateMap';
import DateSelector from '@/domains/trip/components/DateSelector';
import ImageItem from '@/domains/trip/components/ImageItem';
import BackButton from '@/shared/components/common/Button/BackButton';
import Spinner from '@/shared/components/common/Spinner';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/paths';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useScrollHint } from '@/shared/hooks/useScrollHint';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { Location } from '@/shared/types/map';

const ImageByDatePage = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [datesWithImages, setDatesWithImages] = useState<string[]>([]);
    const [imageLocation, setImageLocation] = useState<Location>();
    const [isAllImageLoad, setIsAllImageLoad] = useState(false);

    const showToast = useToastStore((state) => state.showToast);

    const { tripKey } = useParams();
    const {
        state: { startDate, endDate, imageDates, defaultLocation },
    } = useLocation();
    const navigate = useNavigate();

    const imageListRef = useRef<HTMLDivElement>(null);
    const loadedImagesCount = useRef<number>(0);

    const { data: result, isLoading } = useMediaByDate(tripKey!, currentDate || startDate);
    const { isMapScriptLoaded, isMapScriptLoadError } = useMapControl(ZOOM_SCALE.DEFAULT.IMAGE_BY_DATE, DEFAULT_CENTER);
    const { isHintOverlayVisible, isFirstUser } = useScrollHint(imageListRef, isMapScriptLoaded, isAllImageLoad);

    useEffect(() => {
        if (!imageDates?.length) {
            return;
        }
        setDatesWithImages(imageDates);
        setCurrentDate(imageDates[0]);
    }, [imageDates]);

    const imageRefs = useImagesLocationObserver(
        result && 'data' in result && Array.isArray(result.data) ? result.data : [],
        setImageLocation,
    );

    if (isMapScriptLoadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(-1);
    }
    if (!isMapScriptLoaded || isLoading) {
        return <Spinner />;
    }

    if (!result) return <div>데이터를 불러올 수 없습니다.</div>;
    if (!result.success) {
        return <div>데이터를 불러오는데 문제가 발생했습니다.</div>;
    }

    const images = result.data;

    const handleImageLoad = () => {
        loadedImagesCount.current += 1;
        if (loadedImagesCount.current === result.data.length) {
            setIsAllImageLoad(true);
        }
    };

    return (
        <div css={container}>
            <BackButton onClick={() => navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey as string)}`)} />

            <DateMap imageLocation={imageLocation ? imageLocation : defaultLocation} />
            <DateSelector
                currentDate={currentDate || startDate}
                datesWithImages={datesWithImages}
                startDate={startDate}
                onDateSelect={(date: string) => setCurrentDate(date)}
            />

            {(isLoading || !result.data || !isAllImageLoad) && <Spinner text='사진 불러오는 중...' />}
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
    background-color: ${theme.COLORS.BACKGROUND.BLACK};
    position: relative;
`;

const imageListStyle = css`
    max-width: 430px;
    flex: 1;
    overflow-y: auto;
    position: relative;
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
