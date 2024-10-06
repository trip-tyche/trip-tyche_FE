import React, { useEffect, useState, useRef, useCallback } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { ChevronDown, ChevronLeft, ChevronRight, CloudFog, ImageOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getImagesByDay } from '@/api/image';
import { getTripMapData } from '@/api/trip';
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

const INITIAL_ZOOM_SCALE = 15;
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
    const [currentImage, setCurrentImage] = useState<MediaFiles | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    // const { tripId } = location.state as { tripId: string };
    const tripId = localStorage.getItem('tripId');

    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            const data = await getImagesByDay(tripId, currentDate);
            setImagesByDay(data.images);

            if (data?.images?.length > 0) {
                setCurrentImage(data.images[0]);
            }
            setCurrentDay(getDayNumber(currentDate as string, startDate));
        };
        fetchImagesByDay();
    }, [tripId, currentDate, startDate]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6, // 이미지의 60%가 보일 때 트리거
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    setCurrentImage(imagesByDay[index]);
                }
            });
        }, options);

        imageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            imageRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [imagesByDay]);

    const changeDate = (increment: number) => {
        if (!currentDate || !startDate || !endDate) return;

        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + increment);
        const formattedNewDate = newDate.toISOString().split('T')[0];

        setCurrentDate(formattedNewDate);
    };
    const isFirstDay = currentDate === startDate;
    const isLastDay = currentDate === endDate;

    const handleDayClick = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(`${PATH.TIMELINE_MAP}/${tripId}`, { state: { tripId, entryDate } });
        }, 300);
    }, [navigate, tripId, entryDate]);

    return (
        <PageContainer isTransitioning={isTransitioning}>
            <MainContent>
                <MapWrapper>
                    <LoadScript googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={
                                currentImage ? { lat: currentImage.latitude, lng: currentImage.longitude } : undefined
                            }
                            zoom={INITIAL_ZOOM_SCALE}
                            options={mapOptions}
                        >
                            {currentImage && (
                                <Marker position={{ lat: currentImage.latitude, lng: currentImage.longitude }} />
                            )}
                        </GoogleMap>
                    </LoadScript>
                </MapWrapper>
                <div css={dayInfoContentStyle}>
                    <div css={dayArrowStyle}>
                        {!isFirstDay && (
                            <ArrowButton onClick={() => changeDate(-1)}>
                                <ChevronLeft size={24} />
                            </ArrowButton>
                        )}
                        <div css={dayInfoTextStyle}>
                            <h2>{currentDay}</h2>
                            <p>{currentDate && formatDateToKorean(currentDate)}</p>
                        </div>
                        {!isLastDay && (
                            <ArrowButton onClick={() => changeDate(1)}>
                                <ChevronRight size={24} />
                            </ArrowButton>
                        )}
                    </div>
                    <ArrowButton onClick={handleDayClick}>
                        <ChevronDown size={20} />
                    </ArrowButton>
                </div>
                <ImageContent>
                    {imagesByDay ? (
                        imagesByDay.map((image, index) => (
                            <ImageItem
                                key={image.mediaFileId}
                                ref={(el) => (imageRefs.current[index] = el)}
                                data-index={index}
                            >
                                <img src={image.mediaLink} alt={`Image-${image.mediaFileId}`} />
                            </ImageItem>
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
                </ImageContent>
            </MainContent>
        </PageContainer>
    );
};

const PageContainer = styled.div<{ isTransitioning: boolean }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isTransitioning ? 'translateY(100%)' : 'translateY(0)')};
    overflow-y: hidden;
`;

const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #090909;
    overflow-y: auto;
`;

const MapWrapper = styled.div`
    height: 150px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 10;
`;

const mapContainerStyle = {
    height: '100%',
    width: '100%',
    borderRadius: '10px',
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

const dayInfoContentStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${theme.colors.white};
    height: ${theme.heights.xtall_60};
    border-bottom: 1px solid #dddddd;
    padding: 8px 20px 8px 8px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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

const ImageContent = styled.div`
    flex: 1;
    overflow-y: auto;
`;

const ImageItem = styled.div`
    img {
        width: 100%;
        border-radius: 4px;
    }
    margin-bottom: 30px;
`;

export default DaysImages;
