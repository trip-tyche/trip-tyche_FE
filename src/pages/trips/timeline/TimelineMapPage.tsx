import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ogamiIcon from '/public/ogami_1.png';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleMap, Marker, useLoadScript, OverlayView, MarkerClusterer, Polyline } from '@react-google-maps/api';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { BsPersonWalking } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import { ENV } from '@/constants/api';
import { PATH } from '@/constants/path';
import useTimelineStore from '@/stores/useTimelineStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { MediaFile, PinPoint, TripInfo } from '@/types/trip';
import { getDayNumber } from '@/utils/date';

const MOVE_DURATION = 3000;
const WAIT_DURATION = 3000;

const PHOTO_CARD_WIDTH = 80;
const PHOTO_CARD_HEIGHT = 80;

const INITIAL_ZOOM_SCALE = 14;
const SHOW_DETAILED_ZOOM = 14;
const INDIVIDUAL_MARKER_ZOOM = 17;

const TimelineMapPage = () => {
    const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [allImages, setAllImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [currentPinIndex, setCurrentPinIndex] = useState(0);
    const [showPhotoCard, setShowPhotoCard] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isAtPin, setIsAtPin] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentDate, setCurrentDate] = useState<string | undefined>();
    const [currentDay, setCurrentDay] = useState<string | undefined>();
    const [photoCardPosition, setPhotoCardPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [currentZoom, setCurrentZoom] = useState(INITIAL_ZOOM_SCALE);
    const [selectedMarker, setSelectedMarker] = useState<PinPoint | null>(null);
    const [isMapInteractive, setIsMapInteractive] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [imageDates, setImageDates] = useState<string[]>([]);

    const { showToast } = useToastStore();
    const { currentPinPointId, setCurrentPinPointId } = useTimelineStore();

    const mapRef = useRef<google.maps.Map | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const { tripId } = useParams();

    const fetchTripMapData = useCallback(async () => {
        if (!tripId) return;

        try {
            setIsLoading(true);
            const { tripInfo, pinPoints, mediaFiles: images } = await tripAPI.fetchTripTimeline(tripId);
            if (pinPoints.length === 0) {
                showToast('여행에 등록된 사진이 없습니다.');
                navigate(PATH.TRIPS.ROOT);
                return;
            }

            const sortedDataByDate = pinPoints.sort(
                (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
            );

            const imageDates = images.map((image: MediaFile) => image.recordDate.slice(0, 10));
            const uniqueImageDates = [...new Set<string>(imageDates)].sort((a, b) => a.localeCompare(b));

            setTripInfo(tripInfo);
            setAllImages(images);
            setImageDates(uniqueImageDates);
            setPinPoints(sortedDataByDate);
            setCharacterPosition({ lat: sortedDataByDate[0].latitude, lng: sortedDataByDate[0].longitude });
            setIsPlaying(false);
            setIsAtPin(true);
        } catch (error) {
            console.error('Error fetching trip data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [tripId, navigate]);

    // 맵 로드 핸들러 추가
    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        setMapLoaded(true);

        // 리사이즈 이벤트 리스너 추가
        google.maps.event.addListener(map, 'resize', () => {
            if (characterPosition) {
                map.panTo(characterPosition);
            }
        });
    };

    // 포토카드 오프셋 계산 함수
    const getPhotoCardOffset = useCallback(
        (_width: number, _height: number) => {
            if (!mapLoaded) return { x: 0, y: 0 };

            return {
                x: -PHOTO_CARD_WIDTH / 2,
                y: -(PHOTO_CARD_HEIGHT + 75),
            };
        },
        [mapLoaded],
    );

    useEffect(() => {
        fetchTripMapData();

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            setCurrentPinPointId(undefined);
            localStorage.removeItem('lastPinPointId');
        };
    }, [fetchTripMapData]);

    useEffect(() => {
        if (pinPoints.length > 0) {
            // 전역 스토어나 로컬 스토리지에서 마지막 핀포인트 ID 확인
            const lastPinPointId = currentPinPointId || localStorage.getItem('lastPinPointId');

            if (lastPinPointId) {
                const startIndex = pinPoints.findIndex((pin) => String(pin.pinPointId) === lastPinPointId);
                // 여기에서  String(pin.pinPointId) 안하면 -1 아마 숫자로 인식, 그런데 왜 자꾸 string이라 할까?
                if (startIndex !== -1) {
                    setCurrentPinIndex(startIndex);
                    setCharacterPosition({
                        lat: pinPoints[startIndex].latitude,
                        lng: pinPoints[startIndex].longitude,
                    });
                }
                // 사용한 후에는 초기화
                setCurrentPinPointId(undefined);
                localStorage.removeItem('lastPinPointId');
            }
        }
    }, [pinPoints, currentPinPointId]);

    useEffect(() => {
        if (pinPoints.length > 0 && currentPinIndex < pinPoints.length) {
            const currentPin = pinPoints[currentPinIndex];
            setPhotoCardPosition({ lat: currentPin.latitude, lng: currentPin.longitude });
        }
    }, [currentPinIndex, pinPoints]);

    const moveCharacter = useCallback(() => {
        if (currentPinIndex >= pinPoints.length - 1) {
            setIsPlaying(false);
            setIsMoving(false);
            setIsAtPin(true);
            setIsMapInteractive(true);
            return;
        }

        const start = pinPoints[currentPinIndex];
        const end = pinPoints[currentPinIndex + 1];
        setShowPhotoCard(false);
        setIsMoving(true);
        setIsAtPin(false);
        setIsMapInteractive(false); // 캐릭터 이동 시작 시 지도 조작 비활성화

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / MOVE_DURATION, 1);

            const newLat = start.latitude + (end.latitude - start.latitude) * progress;
            const newLng = start.longitude + (end.longitude - start.longitude) * progress;
            const newPosition = { lat: newLat, lng: newLng };
            setCharacterPosition(newPosition);

            if (mapRef.current) {
                mapRef.current.panTo(newPosition);
            }

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                startTimeRef.current = null;
                setCurrentPinIndex((prev) => prev + 1);
                setShowPhotoCard(true);
                setIsMoving(false);
                setIsAtPin(true);
                setIsMapInteractive(true);

                // 새로운 핀포인트 위치로 포토카드 위치 업데이트
                setPhotoCardPosition({ lat: end.latitude, lng: end.longitude });

                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isPlaying) {
                        moveCharacter();
                    }
                }, WAIT_DURATION);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinIndex, pinPoints, isPlaying]);

    useEffect(() => {
        if (isPlaying && !isMoving && isAtPin) {
            autoPlayTimeoutRef.current = setTimeout(() => {
                moveCharacter();
            }, WAIT_DURATION);
        }

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, [isPlaying, isMoving, isAtPin, moveCharacter]);

    useEffect(() => {
        if (pinPoints.length > 0 && tripInfo) {
            const currentPinPoint = pinPoints[currentPinIndex];
            setCurrentDate(currentPinPoint.recordDate);
            setCurrentDay(getDayNumber(currentPinPoint.recordDate, tripInfo.startDate));
        }
    }, [currentPinIndex, pinPoints, tripInfo]);

    useEffect(() => {
        if (characterPosition) {
            setPhotoCardPosition(characterPosition);
        }
    }, [characterPosition]);

    const handleDayClick = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(`${PATH.TRIPS.TIMELINE.DATE(Number(tripId))}`, { state: imageDates });
        }, 300);
    }, [navigate, tripId, tripInfo]);

    const togglePlayPause = useCallback(() => {
        if (currentPinIndex === pinPoints.length - 1) {
            // 마지막 핀포인트에서 처음으로 돌아가기
            setCurrentPinIndex(0);
            setCharacterPosition({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
            if (mapRef.current) {
                mapRef.current.panTo({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
            }
            setShowPhotoCard(true);
            setIsPlaying(true);
            setIsMoving(false);
            setIsAtPin(true);
        } else {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
                // 재생 버튼을 눌렀을 때 즉시 이동 시작
                if (autoPlayTimeoutRef.current) {
                    clearTimeout(autoPlayTimeoutRef.current);
                }
                moveCharacter();
            }
        }
    }, [currentPinIndex, pinPoints, isPlaying, moveCharacter]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
    });

    const characterIcon = useMemo(() => {
        if (isLoaded) {
            return {
                url: ogamiIcon,
                scaledSize: new window.google.maps.Size(50, 65),
                anchor: new window.google.maps.Point(25, 65),
            };
        }
        return null;
    }, [isLoaded]);

    const markerIcon = useMemo(() => {
        if (isLoaded) {
            return {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                fillColor: '#0073bb',
                fillOpacity: 1,
                strokeWeight: 1,
                rotation: 0,
                scale: 1.5,
                anchor: new google.maps.Point(12, 23),
            };
        }
        return null;
    }, [isLoaded]);

    // const polylineOptions = {
    //     strokeColor: `${theme.colors.descriptionText}`,
    //     strokeOpacity: 1,
    //     strokeWeight: 2,
    //     icons: [
    //         {
    //             icon: {
    //                 path: 'M 0,-1 0,1',
    //                 strokeOpacity: 1,
    //                 scale: 4,
    //             },
    //             offset: '0',
    //             repeat: '20px',
    //         },
    //     ],
    // };

    const polylineOptions: google.maps.PolylineOptions = {
        strokeColor: `${theme.colors.descriptionText}`,
        strokeOpacity: 0,
        strokeWeight: 2,
        icons: [
            {
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 0.5,
                    scale: 3,
                },
                offset: '0',
                repeat: '15px',
            },
        ],
    };

    const mapOptions: google.maps.MapOptions = useMemo(
        () => ({
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
            rotateControl: true,
            clickableIcons: false,
            // minZoom: 12,

            draggable: isMapInteractive,
            scrollwheel: isMapInteractive,
            disableDoubleClickZoom: !isMapInteractive,
        }),
        [isMapInteractive],
    );

    const clusterOptions = {
        maxZoom: INDIVIDUAL_MARKER_ZOOM - 1,
        zoomOnClick: true,
        // averageCenter: true,
        minimumClusterSize: 1,
        clickZoom: 2, // 클릭 시 줌 레벨 증가량
        onClick: (cluster: any, _markers: any) => {
            if (mapRef.current) {
                const currentZoom = mapRef.current.getZoom() || 0;
                const newZoom = Math.min(currentZoom + 3, INDIVIDUAL_MARKER_ZOOM - 1);
                mapRef.current.setZoom(newZoom);
                mapRef.current.panTo(cluster.getCenter());
            }
        },
    };

    const handleZoomChanged = () => {
        if (mapRef.current) {
            const newZoom = mapRef.current.getZoom();
            if (newZoom !== undefined) {
                setCurrentZoom(newZoom);
            }
        }
    };

    const showDetailedView = currentZoom === SHOW_DETAILED_ZOOM;
    const showIndividualMarkers = currentZoom >= INDIVIDUAL_MARKER_ZOOM;

    const handleHomeClick = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.setZoom(SHOW_DETAILED_ZOOM);
            if (characterPosition) {
                mapRef.current.panTo(characterPosition);
            }
        }
    }, [characterPosition]);

    const handleMarkerClick = (marker: PinPoint) => {
        setSelectedMarker(marker);
        if (mapRef.current) {
            mapRef.current.panTo({ lat: marker.latitude, lng: marker.longitude });
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return (
            <div css={loadingStyle}>
                <Spinner />
            </div>
        );
    }

    const renderPhotoCard = (marker: PinPoint) => (
        <OverlayView
            position={{ lat: marker.latitude, lng: marker.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(_width, _height) => ({
                x: -(PHOTO_CARD_WIDTH / 2),
                y: -(PHOTO_CARD_HEIGHT + 45),
            })}
        >
            <div css={clusterPhotoCardStyle}>
                <img css={imageStyle} src={marker.mediaLink} alt='photo-card' />
            </div>
        </OverlayView>
    );

    const renderControls = () => {
        if (showDetailedView) {
            return (
                <>
                    {isAtPin && (
                        <ControlButton onClick={togglePlayPause}>
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </ControlButton>
                    )}
                    {isAtPin && (
                        <DaySection onClick={handleDayClick}>
                            <div css={dayInfoTextStyle}>
                                <h2>날짜별로 사진보기</h2>
                            </div>
                            <ChevronUp size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
                        </DaySection>
                    )}
                </>
            );
        } else {
            return (
                <ControlDefaultButton onClick={handleHomeClick}>
                    <BsPersonWalking />
                </ControlDefaultButton>
            );
        }
    };

    const renderPolyline = () => {
        if (pinPoints.length < 2) return null;

        const path = pinPoints.map((point) => ({ lat: point.latitude, lng: point.longitude }));

        return <Polyline path={path} options={polylineOptions} />;
    };

    const renderMarkers = () => {
        if (showDetailedView) {
            return (
                <>
                    {renderPolyline()}
                    {pinPoints.map((point, index) => (
                        <React.Fragment key={point.pinPointId}>
                            <Marker
                                position={{ lat: point.latitude, lng: point.longitude }}
                                icon={markerIcon || undefined}
                            />
                            <OverlayView
                                position={{ lat: point.latitude, lng: point.longitude }}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                // getPixelPositionOffset={(_width, _height) => ({
                                //     x: -PHOTO_CARD_WIDTH / 2,
                                //     y: -(PHOTO_CARD_HEIGHT + 75),
                                // })}
                                getPixelPositionOffset={getPhotoCardOffset}
                            >
                                <div
                                    css={photoCardStyle(index === currentPinIndex && isAtPin)}
                                    onClick={() =>
                                        navigate(`${PATH.TRIPS.TIMELINE.PINPOINT(Number(tripId), point.pinPointId)}`)
                                    }
                                >
                                    <img css={imageStyle} src={point.mediaLink} alt='photo-card' />
                                </div>
                            </OverlayView>
                        </React.Fragment>
                    ))}
                    {characterPosition && (
                        <Marker position={characterPosition} icon={characterIcon || undefined} zIndex={1000} />
                    )}
                    {/* {showPhotoCard && photoCardPosition && currentPinIndex < pinPoints.length && (
                        <OverlayView
                            position={photoCardPosition}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            getPixelPositionOffset={(_width, _height) => ({
                                x: -PHOTO_CARD_WIDTH / 2,
                                y: -(PHOTO_CARD_HEIGHT + 75),
                                // y: -PHOTO_CARD_HEIGHT,
                            })}
                        >
                            <div
                                css={photoCardStyle}
                                onClick={() =>
                                    navigate(`/music-video/${tripId}/${pinPoints[currentPinIndex].pinPointId}`)
                                }
                            >
                                <img css={imageStyle} src={pinPoints[currentPinIndex].mediaLink} alt='photo-card' />
                            </div>
                        </OverlayView>
                    )} */}
                    {/* {isAtPin && (
                        <DaySection onClick={handleDayClick}>
                            <div css={dayInfoTextStyle}>
                                <h2>{currentDay}</h2>
                                <p>{currentDate && formatDateToKorean(currentDate)}</p>
                            </div>
                            <ChevronUp size={20} />
                        </DaySection>
                    )} */}
                </>
            );
        } else if (showIndividualMarkers) {
            return (
                <>
                    {renderPolyline()}
                    {allImages.map((image) => (
                        <Marker
                            key={image.mediaFileId}
                            position={{ lat: image.latitude, lng: image.longitude }}
                            icon={markerIcon || undefined}
                            onClick={() => handleMarkerClick(image as PinPoint)}
                        />
                    ))}
                    {selectedMarker && renderPhotoCard(selectedMarker)}
                </>
            );
        } else {
            return (
                <MarkerClusterer options={clusterOptions}>
                    {(clusterer) => (
                        <>
                            {renderPolyline()}
                            {allImages.map((image) => (
                                <Marker
                                    key={image.mediaFileId}
                                    position={{ lat: image.latitude, lng: image.longitude }}
                                    clusterer={clusterer}
                                    icon={markerIcon || undefined}
                                />
                            ))}
                        </>
                    )}
                </MarkerClusterer>
            );
        }
    };

    return (
        <PageContainer isTransitioning={isTransitioning}>
            <Header title={tripInfo?.tripTitle || ''} isBackButton onBack={() => navigate(PATH.TRIPS.ROOT)} />
            <MapWrapper>
                {isLoading ? (
                    <LoadingWrapper>
                        <Spinner />
                    </LoadingWrapper>
                ) : (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={characterPosition || undefined}
                        zoom={INITIAL_ZOOM_SCALE}
                        options={mapOptions}
                        // onLoad={(map) => {
                        //     mapRef.current = map;
                        // }}
                        onLoad={handleMapLoad}
                        onZoomChanged={handleZoomChanged}
                        onClick={() => setSelectedMarker(null)}
                    >
                        {renderMarkers()}
                        {renderControls()}
                    </GoogleMap>
                )}
            </MapWrapper>
        </PageContainer>
    );
};

const DaySection = styled.div`
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    height: 54px;
    background-color: ${theme.colors.white};
`;

const dayInfoTextStyle = css`
    h2 {
        font-size: ${theme.fontSizes.large_16};
        color: ${theme.colors.descriptionText};
        color: ${theme.colors.secondary};
        font-weight: 600;
        margin: 0;
    }
`;

const loadingStyle = css`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MapWrapper = styled.div`
    flex-grow: 1;
    position: relative;
    z-index: 0;
    min-height: 400px;
`;

const ControlDefaultButton = styled.button`
    position: absolute;
    bottom: 35px;
    right: 15px;
    font-size: 18px;
    background-color: white;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${theme.colors.white};
        color: ${theme.colors.primary};
    }
`;

const ControlButton = styled.button`
    position: absolute;
    bottom: 84px;
    right: 10px;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${theme.colors.white};
        color: ${theme.colors.primary};
    }
`;

const PageContainer = styled.div<{ isTransitioning: boolean }>`
    overflow: hidden;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isTransitioning ? 'translateY(-100%)' : 'translateY(0)')};
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 54px);
`;

const mapContainerStyle = {
    height: 'calc(100% + 20px)',
    width: '100%',
    paddingTop: '20px',
};

const clusterPhotoCardStyle = css`
    background-color: ${theme.colors.white};
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 150px;
    height: auto;
    padding: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        border: 1px solid #ccc;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
            rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
`;

const photoCardStyle = (isCurrentPin: boolean) => css`
    background-color: ${theme.colors.white};
    width: ${PHOTO_CARD_WIDTH}px;
    height: ${PHOTO_CARD_HEIGHT}px;
    border-radius: 50%;
    height: auto;
    padding: 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
    transition: opacity 0.3s ease;
    opacity: ${isCurrentPin ? 1 : 0};
    visibility: ${isCurrentPin ? 'visible' : 'hidden'};
    pointer-events: ${isCurrentPin ? 'auto' : 'none'};
    /* display: ${isCurrentPin ? 'block' : 'none'}; */

    p {
        font-size: 18px;
        color: #333;
        /* color: ${theme.colors.primary}; */
        font-weight: 600;
        align-self: start;
        padding: 4px;
    }

    &:hover {
        transform: scale(1.05);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        border: 1px solid #ccc;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
            rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
`;

const imageStyle = css`
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
    border-radius: 50%;
`;

export default TimelineMapPage;
