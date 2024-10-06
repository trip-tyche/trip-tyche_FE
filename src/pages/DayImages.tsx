import React, { useEffect, useState, useRef, useCallback } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleMap, Marker, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { ChevronDown, ChevronLeft, ChevronRight, CloudFog, ImageOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getImagesByDay } from '@/api/image';
import { getTripMapData } from '@/api/trip';
import Loading from '@/components/common/Loading';
import { ENV } from '@/constants/auth';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';
import { formatDateToKorean, getDayNumber } from '@/utils/date';

interface MediaFiles {
    latitude: number;
    longitude: number;
    mediaFileId: number;
    mediaLink: string;
}

const INITIAL_ZOOM_SCALE = 16;
const mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    rotateControl: false,
    clickableIcons: false,
    minZoom: 12,
};

const DaysImages: React.FC = () => {
    const [imagesByDay, setImagesByDay] = useState<MediaFiles[]>([]);
    const [entryDate, setEntryDate] = useState<string>();
    const [currentDate, setCurrentDate] = useState<string>();
    const [currentDay, setCurrentDay] = useState<string>();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [totalDays, setTotalDays] = useState<number>(0);

    const navigate = useNavigate();
    const location = useLocation();
    const tripId = localStorage.getItem('tripId');

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
        language: 'ko', // 한국어 설정 추가
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleDayClick = (day: number) => {
        if (!startDate) return;
        const clickedDate = new Date(startDate);
        clickedDate.setDate(clickedDate.getDate() + day - 1);
        const formattedDate = clickedDate.toISOString().split('T')[0];
        setCurrentDate(formattedDate);

        // 선택된 Day 버튼을 중앙으로 스크롤
        setTimeout(() => {
            const container = scrollContainerRef.current;
            const button = container?.querySelector(`button:nth-child(${day})`) as HTMLElement;
            if (container && button) {
                const containerWidth = container.offsetWidth;
                const buttonWidth = button.offsetWidth;
                const scrollLeft = button.offsetLeft - containerWidth / 2 + buttonWidth / 2;

                container.scrollTo({
                    left: Math.max(0, Math.min(scrollLeft, container.scrollWidth - containerWidth)),
                    behavior: 'smooth',
                });
            }
        }, 0);
    };

    useEffect(() => {
        const { currentDate } = location.state;
        setCurrentDate(currentDate);
        setEntryDate(currentDate);
    }, [location.state]);

    // 여행정보(시작일, 종료일)
    useEffect(() => {
        const fetchTripInfo = async () => {
            if (!tripId) {
                return;
            }
            const data = await getTripMapData(tripId);
            const { tripInfo } = data;
            setStartDate(tripInfo.startDate);
            setEndDate(tripInfo.endDate);
        };

        fetchTripInfo();
    }, []);

    // 현재 날짜의 이미지
    useEffect(() => {
        const fetchImagesByDay = async () => {
            if (!(tripId && currentDate)) {
                return;
            }
            setIsLoading(true);
            try {
                const data = await getImagesByDay(tripId, currentDate);
                setImagesByDay(data.images || []);

                setCurrentDay(getDayNumber(currentDate as string, startDate));
            } catch (error) {
                console.error('Error fetching images:', error);
                setImagesByDay([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchImagesByDay();
    }, [tripId, currentDate, startDate]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
            setTotalDays(dayDiff);
        }
    }, [startDate, endDate]);

    const generateDayList = () => Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <PageContainer isTransitioning={isTransitioning}>
            <DateSelectionDiv>
                <DayScrollContainer ref={scrollContainerRef}>
                    {generateDayList().map((day) => (
                        <DayButton
                            key={day}
                            onClick={() => handleDayClick(day)}
                            isSelected={currentDay === `Day ${day}`}
                        >
                            Day {day}
                        </DayButton>
                    ))}
                </DayScrollContainer>
                <ArrowButton
                    onClick={() => {
                        setIsTransitioning(true);
                        navigate(`${PATH.TIMELINE_MAP}/${tripId}`);
                    }}
                >
                    <ChevronDown size={20} />
                </ArrowButton>
            </DateSelectionDiv>
            <ImageMapList>
                {isLoading ? (
                    <div css={spinnerStyle}>
                        <Loading type='bgBlack' />
                    </div>
                ) : imagesByDay.length > 0 ? (
                    imagesByDay.map((image) => (
                        <React.Fragment key={image.mediaFileId}>
                            <ImageItem>
                                <img src={image.mediaLink} alt={`Image-${image.mediaFileId}`} />
                            </ImageItem>
                            {isLoaded && (
                                <MapItem>
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={{ lat: image.latitude, lng: image.longitude }}
                                        zoom={INITIAL_ZOOM_SCALE}
                                        options={mapOptions}
                                    >
                                        <Marker position={{ lat: image.latitude, lng: image.longitude }} />
                                    </GoogleMap>
                                </MapItem>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <div css={noImagesStyle}>
                        <ImageOff size={40} color='#FDFDFD' />
                        <div>
                            <p>오늘은 사진이 없네요..</p>
                            <p>사진을 추가해주세요:)</p>
                        </div>
                    </div>
                )}
            </ImageMapList>
        </PageContainer>
    );
};

const DateSelectionDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${theme.colors.white};
    height: ${theme.heights.xtall_60};
    border-bottom: 1px solid #dddddd;
    padding: 8px 20px 8px 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
    padding: 0 10px;
`;

const DayButton = styled.button<{ isSelected: boolean }>`
    background: none;
    border: none;
    padding: 8px 16px;
    margin-right: 8px;
    cursor: pointer;
    font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
    font-size: ${(props) => (props.isSelected ? '18px' : '14px')};
    color: ${(props) => (props.isSelected ? theme.colors.primary : theme.colors.darkGray)};
    flex-shrink: 0;
`;

const spinnerStyle = css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const PageContainer = styled.div<{ isTransitioning: boolean }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isTransitioning ? 'translateY(100%)' : 'translateY(0)')};
    overflow-y: auto;
    background-color: #090909;
`;

// const DateSelectionDiv = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     background-color: ${theme.colors.white};
//     height: ${theme.heights.xtall_60};
//     border-bottom: 1px solid #dddddd;
//     padding: 8px 20px 8px 8px;
//     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

const ImageMapList = styled.div`
    flex: 1;
    overflow-y: auto;
`;

const ImageItem = styled.div`
    img {
        width: 100%;
        border-radius: 4px;
    }
`;

const MapItem = styled.div`
    height: 200px;
    margin-bottom: 40px;
    border-radius: 4px;
    overflow: hidden;
`;

const mapContainerStyle = {
    height: '100%',
    width: '100%',
};

const ArrowButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const dayArrowStyle = css`
    width: 50%;
    display: flex;
    justify-content: space-between;
`;

const dayInfoTextStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
    }

    p {
        font-size: 14px;
        color: ${theme.colors.darkGray};
        margin: 0;
    }
`;

const noImagesStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 14px;

    p {
        color: ${theme.colors.secondary};
        font-size: 14px;
        margin-bottom: 6px;
    }
`;

export default DaysImages;
