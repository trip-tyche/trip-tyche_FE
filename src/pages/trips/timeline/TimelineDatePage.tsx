import React, { useEffect, useState, useRef, useCallback } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { ChevronDown, ArrowDown } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Spinner from '@/components/common/Spinner';
import DateMap from '@/components/features/timeline/DateMap';
import { GOOGLE_MAPS_IMAGE_BY_DATE_ZOOM, GOOGLE_MAPS_OPTIONS } from '@/constants/googleMaps';
import { PATH } from '@/constants/path';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { LatLngLiteralType } from '@/types/googleMaps';
import { MediaFile } from '@/types/trip';
import { getDayNumber } from '@/utils/date';

const TimelineDatePage: React.FC = () => {
    const [imagesByDate, setImagesByDate] = useState<MediaFile[]>([]);
    const [imageLocation, setImageLocation] = useState<LatLngLiteralType>();
    const [currentDate, setCurrentDate] = useState('');

    const [startDate, setStartDate] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [isHintOverlayVisible, setIsHintOverlayVisible] = useState(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loadedImageCount, setLoadedImageCount] = useState(0);

    const { isLoaded, loadError } = useGoogleMaps();
    const showToast = useToastStore((state) => state.showToast);

    const { tripId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const imageListRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const getImagesByDate = async () => {
            if (!(tripId && currentDate)) {
                return;
            }
            setLoadedImageCount(0);
            setIsImageLoaded(false);
            const { images } = await tripImageAPI.fetchImagesByDate(tripId, currentDate);
            setImagesByDate(images || []);

            if (images && images.length > 0) {
                setImageLocation({ lat: images[0].latitude, lng: images[0].longitude });
            }
        };

        getImagesByDate();
    }, [tripId, currentDate, showToast]);

    useEffect(() => {
        const imageDates = location?.state || [];

        if (!imageDates || imageDates.length === 0) return;
        setAvailableDates(imageDates);
        setStartDate(imageDates[0]);
        setCurrentDate(imageDates[0]);
    }, [location.state]);

    const smoothScroll = (element: HTMLElement, target: number, duration: number) => {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeInOutCubic =
                progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            element.scrollTop = start + change * easeInOutCubic;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    useEffect(() => {
        if (isLoaded && isImageLoaded && imageListRef.current && isFirstLoad) {
            setIsHintOverlayVisible(true);

            const element = imageListRef.current;
            const scrollDown = () => smoothScroll(element, 80, 1000);
            const scrollUp = () => smoothScroll(element, 0, 1000);

            const hideHint = () => {
                setIsHintOverlayVisible(false);
                setIsFirstLoad(false);
            };

            const timeoutIds = [setTimeout(scrollDown, 100), setTimeout(scrollUp, 1500), setTimeout(hideHint, 2500)];

            return () => {
                timeoutIds.forEach(clearTimeout);
            };
        }
    }, [isLoaded, isImageLoaded, isFirstLoad]);

    // const generateDayList = () => Array.from({ length: totalDays }, (_, i) => i + 1);
    const generateDayList = () => {
        if (!startDate || !availableDates.length) return [];

        return availableDates.map((date) => {
            const dayNumber = getDayNumber(date, startDate);
            return { date, dayNumber };
        });
    };

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                    const image = imagesByDate[index];
                    if (image) {
                        setImageLocation({ lat: image.latitude, lng: image.longitude });
                    }
                }
            });
        },
        [imagesByDate],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        });

        imageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            imageRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [observerCallback, imagesByDate]);

    const handleArrowButtonClick = () => {
        setIsTransitioning(true);
        navigate(`${PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
    };

    const handleDayButtonClick = (date: string) => {
        setCurrentDate(date);
    };

    useEffect(() => {
        if (loadedImageCount === imagesByDate.length) {
            setIsImageLoaded(true);
        }
    }, [loadedImageCount, imagesByDate]);

    const handleImageLoad = () => {
        setLoadedImageCount((prev) => {
            const loadedImageCount = prev + 1;
            return loadedImageCount;
        });
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

                <section css={dateScrollStyle}>
                    <DayScrollContainer ref={scrollContainerRef}>
                        {generateDayList().map(({ date, dayNumber }) => (
                            <button
                                key={date}
                                css={dayButtonStyle(currentDate === date)}
                                onClick={() => handleDayButtonClick(date)}
                            >
                                {dayNumber}
                            </button>
                        ))}
                    </DayScrollContainer>
                    <button css={arrowButtonStyle} onClick={handleArrowButtonClick}>
                        <ChevronDown size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
                    </button>
                </section>

                <section ref={imageListRef} css={imageListStyle}>
                    {imagesByDate.map((image, index) => (
                        <div
                            ref={(el) => (imageRefs.current[index] = el)}
                            key={image.mediaFileId}
                            css={imageItemStyle}
                            data-index={index}
                        >
                            <img src={image.mediaLink} alt={`이미지 ${image.mediaFileId}`} onLoad={handleImageLoad} />
                            {isImageLoaded && <p>{image.recordDate.split('T')[1]}</p>}
                        </div>
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

const DayScrollContainer = styled.div`
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
