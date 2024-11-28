import React, { useEffect, useState, useRef } from 'react';

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
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    const { isLoaded, loadError } = useGoogleMaps();
    const showToast = useToastStore((state) => state.showToast);

    const { tripId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const imageListRef = useRef<HTMLDivElement>(null);

    const { imagesByDate, imageLocation, isImageLoaded, setImageLocation, handleImageLoad } = useImagesByDate(
        tripId || '',
        currentDate,
    );
    const { isHintOverlayVisible, isFirstLoad } = useScrollHint(imageListRef, isLoaded, isImageLoaded);
    const imageRefs = useImagesLocationObserver(imagesByDate, setImageLocation);

    useEffect(() => {
        const imageDates = location?.state || [];

        if (!imageDates || imageDates.length === 0) {
            return;
        }

        setAvailableDates(imageDates);
        setStartDate(imageDates[0]);
        setCurrentDate(imageDates[0]);
    }, [location.state]);

    const handleArrowButtonClick = () => {
        setIsTransitioning(true);
        navigate(`${PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
    };

    const handleDayButtonClick = (date: string) => {
        setCurrentDate(date);
    };

    if (loadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
    }

    if (!isLoaded) {
        return <Spinner />;
    }

    return (
        <div css={pageContainer(isTransitioning)}>
            <>
                {imageLocation && <DateMap imageLocation={imageLocation} />}

                <DateSelector
                    currentDate={currentDate}
                    availableDates={availableDates}
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
            </>
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

const mapWrapper = css`
    height: 170px;
    overflow: hidden;
`;

const dateScrollStyle = css`
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
    /* padding: 0 10px; */
`;

const dayButtonStyle = (isSelected: boolean) => css`
    background: none;
    border: none;
    padding: 8px 16px;
    margin-right: 8px;
    cursor: pointer;
    font-weight: ${isSelected ? 'bold' : 'normal'};
    font-size: ${isSelected ? '18px' : '14px'};
    color: ${isSelected ? theme.colors.primary : theme.colors.darkGray};
    flex-shrink: 0;
`;

const arrowButtonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
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
        top: 224px;
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
        top: 224px;
        bottom: 0;
        width: 28px;
        background-color: ${theme.colors.backGround.black};
        z-index: 10;
        box-shadow: -1px 0 3px rgba(0, 0, 0, 0.3);

        // 필름 구멍 패턴
        /* background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.7) 4px, transparent 4px); */
        background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 5px,
            rgba(255, 255, 255, 0.9) 5px,
            rgba(255, 255, 255, 0.9) 15px,
            transparent 15px,
            transparent 20px
        );
        /* background-size: 20px 20px;
        background-position: center;
        background-repeat: repeat-y; */
        background-size: 12px 24px;
        background-position: center;
        background-repeat: repeat-y;
    }
`;

const imageForLoadStyle = css`
    opacity: 0;
`;

const imageItemStyle = css`
    margin-bottom: 12px;
    position: relative;
    padding: 0 20px; // 양쪽에 필름 스트립 공간 확보
    width: 100%;

    img {
        width: 100%;
        border-radius: 4px;
    }

    p {
        z-index: 2;
        position: absolute;
        bottom: 8px;
        right: 30px;
        margin: 0;
        padding: 2px 4px;
        font-family: 'DS-DIGII', sans-serif;
        font-weight: bold;
        font-style: italic;
        font-size: ${theme.fontSizes.xlarge_18};
        color: #ff9b37;
        letter-spacing: 1px;
        opacity: 0.95;

        text-shadow:
            0 0 5px rgba(255, 155, 55, 0.7),
            /* 내부 글로우 */ 0 0 10px rgba(255, 155, 55, 0.5),
            /* 중간 글로우 */ 0 0 15px rgba(255, 155, 55, 0.3),
            /* 외부 글로우 */ 1px 1px 2px rgba(0, 0, 0, 0.1); /* 가독성을 위한 엣지 섀도우 */

        &::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(0, 0, 0, 0.05);
            filter: blur(4px);
            z-index: -1;
            border-radius: 4px;
        }
    }

    div {
        color: white;
        margin-left: 20px;
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
