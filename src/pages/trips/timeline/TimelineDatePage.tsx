import { useEffect, useState, useRef } from 'react';

import { css } from '@emotion/react';
import { ArrowDown } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Spinner from '@/components/common/Spinner';
import DateMap from '@/components/features/timeline/DateMap';
import DateSelector from '@/components/features/timeline/DateSelector';
import ImageItem from '@/components/features/timeline/ImageItem';
import { PATH } from '@/constants/path';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useImagesByDate } from '@/hooks/useImagesByDate';
import { useImagesLocationObserver } from '@/hooks/useImagesLocationObserver';
import { useScrollHint } from '@/hooks/useScrollHint';
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
    const { state: imageDates } = useLocation();
    const navigate = useNavigate();

    const imageListRef = useRef<HTMLDivElement>(null);

    const { imagesByDate, imageLocation, isImageLoaded, setImageLocation, handleImageLoad } = useImagesByDate(
        tripId || '',
        currentDate,
    );
    const { isHintOverlayVisible, isFirstLoad } = useScrollHint(imageListRef, isLoaded, isImageLoaded);
    const imageRefs = useImagesLocationObserver(imagesByDate, setImageLocation);

    useEffect(() => {
        if (!imageDates || imageDates.length === 0) {
            return;
        }

        setDatesWithImages(imageDates);
        setStartDate(imageDates[0]);
        setCurrentDate(imageDates[0]);
    }, [imageDates]);

    const handleArrowButtonClick = () => {
        setIsTransitioning(true);
        navigate(`${PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
    };

    const handleDayButtonClick = (date: string) => {
        setCurrentDate(date);
    };

    if (loadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(-1);
    }

    if (!isLoaded) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer(isTransitioning)}>
            {imageLocation && <DateMap imageLocation={imageLocation} />}

            <DateSelector
                currentDate={currentDate}
                datesWithImages={datesWithImages}
                startDate={startDate}
                onDateSelect={handleDayButtonClick}
                onArrowButtonClick={handleArrowButtonClick}
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
                        <ArrowDown size={24} color={theme.colors.white} />
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
    background-color: ${theme.colors.backGround.black};
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
        background-color: ${theme.colors.backGround.black};
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
        background-color: ${theme.colors.backGround.black};
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
    color: ${theme.colors.white};
    text-align: center;
    margin: 0;
`;

export default TimelineDatePage;
