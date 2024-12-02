import { useEffect, useState, useRef, useCallback } from 'react';

import { css } from '@emotion/react';
import { ArrowDown, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Spinner from '@/components/common/Spinner';
import DateMap from '@/components/features/timeline/DateMap';
import DateSelector from '@/components/features/timeline/DateSelector';
import ImageItem from '@/components/features/timeline/ImageItem';
import { ROUTES } from '@/constants/paths';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useImagesByDate } from '@/hooks/useImagesByDate';
import { useImagesLocationObserver } from '@/hooks/useImagesLocationObserver';
import { useScrollHint } from '@/hooks/useScrollHint';
import useTimelineStore from '@/stores/useTimelineStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';

const TimelineDatePage = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [datesWithImages, setDatesWithImages] = useState<string[]>([]);

    const { isLoaded, loadError } = useGoogleMaps();
    const showToast = useToastStore((state) => state.showToast);

    const { tripId } = useParams();
    const {
        state: { imagesByDates: imageDates, pinPointId },
    } = useLocation();

    const navigate = useNavigate();

    const imageListRef = useRef<HTMLDivElement>(null);

    const { imagesByDate, imageLocation, isImageLoaded, setImageLocation, handleImageLoad } = useImagesByDate(
        tripId || '',
        currentDate,
    );
    const { isHintOverlayVisible, isFirstLoad } = useScrollHint(imageListRef, isLoaded, isImageLoaded);
    const imageRefs = useImagesLocationObserver(imagesByDate, setImageLocation);
    const setLastPinPointId = useTimelineStore((state) => state.setLastPinPointId);

    useEffect(() => {
        if (!imageDates?.length) {
            return;
        }

        setDatesWithImages(imageDates);
        setStartDate(imageDates[0]);
        setCurrentDate(imageDates[0]);
    }, [imageDates]);

    const handleArrowButtonClick = useCallback(() => {
        setIsTransitioning(true);
        navigate(`${ROUTES.PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);

        setLastPinPointId(pinPointId);
        localStorage.setItem('lastPinPointId', pinPointId);
    }, [navigate, tripId, pinPointId, setLastPinPointId]);

    const handleDateButtonClick = useCallback((date: string) => {
        setCurrentDate(date);
    }, []);

    if (loadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(-1);
    }

    if (!isLoaded) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer(isTransitioning)}>
            <button css={backButtonStyle} onClick={handleArrowButtonClick}>
                <ChevronLeft color={theme.COLORS.TEXT.DESCRIPTION} size={24} strokeWidth={1.5} />
            </button>

            {imageLocation && <DateMap imageLocation={imageLocation} />}

            <DateSelector
                currentDate={currentDate}
                datesWithImages={datesWithImages}
                startDate={startDate}
                onDateSelect={handleDateButtonClick}
            />

            <section ref={imageListRef} css={imageListStyle}>
                {imagesByDate.map((image, index) => (
                    <ImageItem
                        key={image.mediaFileId}
                        image={image}
                        index={index}
                        onImageLoad={handleImageLoad}
                        isImageLoaded={isImageLoaded}
                        reference={(element) => (imageRefs.current[index] = element)}
                    />
                ))}
            </section>

            {isFirstLoad && (
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

const pageContainer = (isTransitioning: boolean) => css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: ${isTransitioning ? 'translateY(100%)' : 'translateY(0)'};
    overflow-y: auto;
    background-color: ${theme.COLORS.BACKGROUND.BLACK};
    position: relative;
`;

const backButtonStyle = css`
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 8px;
    border: 1px solid ${theme.COLORS.TEXT.DESCRIPTION};
    border: none;
    box-shadow:
        rgba(50, 50, 93, 0.25) 13px 13px 30px -10px,
        rgba(0, 0, 0, 0.8) 5px 8px 16px -10px;
    border-radius: 4px;
    cursor: pointer;
`;

const imageListStyle = css`
    flex: 1;
    overflow-y: auto;
    position: relative;

    &::before {
        content: '';
        position: fixed;
        left: 0;
        top: 234px;
        bottom: 0;
        width: 28px;
        background-color: ${theme.COLORS.BACKGROUND.BLACK};
        z-index: 10;
        box-shadow: 1px 0 3px rgba(0, 0, 0, 0.3);

        background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 5px,
            rgba(255, 255, 255, 0.9) 5px,
            rgba(255, 255, 255, 0.9) 15px,
            transparent 15px,
            transparent 20px
        );
        background-size: 12px 24px;
        background-position: center;
        background-repeat: repeat-y;
    }

    &::after {
        content: '';
        position: fixed;
        right: 0;
        top: 234px;
        bottom: 0;
        width: 28px;
        background-color: ${theme.COLORS.BACKGROUND.BLACK};
        z-index: 10;
        box-shadow: -1px 0 3px rgba(0, 0, 0, 0.3);

        background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 5px,
            rgba(255, 255, 255, 0.9) 5px,
            rgba(255, 255, 255, 0.9) 15px,
            transparent 15px,
            transparent 20px
        );
        background-size: 12px 24px;
        background-position: center;
        background-repeat: repeat-y;
    }
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

export default TimelineDatePage;
