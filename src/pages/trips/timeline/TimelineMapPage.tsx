import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ogamiIcon from '/public/ogami_1.png';

import { css } from '@emotion/react';
import { GoogleMap, Marker, OverlayView, MarkerClusterer, Polyline } from '@react-google-maps/api';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { BsPersonWalking } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import { GOOGLE_MAPS_OPTIONS, POLYLINE_OPTIONS } from '@/constants/googleMaps';
import { PATH } from '@/constants/path';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import useTimelineStore from '@/stores/useTimelineStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { LatLngLiteralType, MapsType } from '@/types/googleMaps';
import { MediaFile, PinPoint, TripInfo } from '@/types/trip';
import { getDayNumber } from '@/utils/date';

const MOVE_DURATION = 3000;
const WAIT_DURATION = 3000;

const PHOTO_CARD_WIDTH = 100;
const PHOTO_CARD_HEIGHT = 100;

const INITIAL_ZOOM_SCALE = 14;
const SHOW_DETAILED_ZOOM = 14;
const INDIVIDUAL_MARKER_ZOOM = 17;

const TimelineMapPage = () => {
    const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [allImages, setAllImages] = useState<any[]>([]);
    const [characterPosition, setCharacterPosition] = useState<LatLngLiteralType>();
    const [photoCardPosition, setPhotoCardPosition] = useState<LatLngLiteralType>();
    const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
    const [isCharacterMoving, setIsCharacterMoving] = useState(false);

    const [currentPinIndex, setCurrentPinIndex] = useState(0);
    const [showPhotoCard, setShowPhotoCard] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentDate, setCurrentDate] = useState<string | undefined>();
    const [currentDay, setCurrentDay] = useState<string | undefined>();
    const [currentZoom, setCurrentZoom] = useState(INITIAL_ZOOM_SCALE);
    const [selectedMarker, setSelectedMarker] = useState<PinPoint | null>(null);
    const [isMapInteractive, setIsMapInteractive] = useState(true);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [imageDates, setImageDates] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const { showToast } = useToastStore();
    const { currentPinPointId, setCurrentPinPointId } = useTimelineStore();

    const { isLoaded, loadError, markerIcon } = useGoogleMaps();

    const mapRef = useRef<google.maps.Map | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const { tripId } = useParams();

    //  Google Maps가 처음 로드될 때 실행되는 핸들러 함수
    const handleMapLoad = (map: MapsType) => {
        mapRef.current = map;
        setIsMapLoaded(true); // 맵 로드 상태 변경

        if (characterPosition) {
            setPhotoCardPosition({ ...characterPosition });
        }

        // // 지도 타일 로드 완료 이벤트 리스너 추가
        // google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
        //     if (characterPosition) {
        //         setPhotoCardPosition({ ...characterPosition });
        //     }
        // });
    };

    // 포토카드 오프셋 계산 함수
    const getPhotoCardOffset = useCallback(() => {
        return {
            x: -PHOTO_CARD_WIDTH / 2,
            y: -(PHOTO_CARD_HEIGHT + 75),
        };
    }, []);

    useEffect(() => {
        const getTimelineMapData = async () => {
            if (!tripId) {
                return;
            }

            setIsLoading(true);
            const { tripInfo, pinPoints, mediaFiles: images } = await tripAPI.fetchTripTimeline(tripId);

            if (pinPoints.length === 0) {
                showToast('여행에 등록된 사진이 없습니다.');
                navigate(PATH.TRIPS.ROOT);
                return;
            }

            const sortedPinPointByDate = pinPoints.sort(
                (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
            );
            const imageDates = images.map((image: MediaFile) => image.recordDate.split('T')[0]);
            const uniqueImageDates = [...new Set<string>([tripInfo.startDate, ...imageDates])].sort((a, b) =>
                a.localeCompare(b),
            );

            setTripInfo(tripInfo);
            setAllImages(images);
            setImageDates(uniqueImageDates);
            setPinPoints(sortedPinPointByDate);

            setCharacterPosition({ lat: sortedPinPointByDate[0].latitude, lng: sortedPinPointByDate[0].longitude });
            setIsPlayingAnimation(false);
            setIsCharacterMoving(false);
            setIsLoading(false);
        };

        getTimelineMapData();

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
    }, []);

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
            setIsPlayingAnimation(false);
            // setIsMoving(false);
            setIsCharacterMoving(false);
            setIsMapInteractive(true);
            return;
        }

        const start = pinPoints[currentPinIndex];
        const end = pinPoints[currentPinIndex + 1];
        setShowPhotoCard(false);
        // setIsMoving(true);
        setIsCharacterMoving(true);
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
                // setIsMoving(false);
                setIsCharacterMoving(false);
                setIsMapInteractive(true);

                // 새로운 핀포인트 위치로 포토카드 위치 업데이트
                setPhotoCardPosition({ lat: end.latitude, lng: end.longitude });

                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isPlayingAnimation) {
                        moveCharacter();
                    }
                }, WAIT_DURATION);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinIndex, pinPoints, isPlayingAnimation]);

    useEffect(() => {
        if (isPlayingAnimation && !isCharacterMoving) {
            autoPlayTimeoutRef.current = setTimeout(() => {
                moveCharacter();
            }, WAIT_DURATION);
        }

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, [isPlayingAnimation, isCharacterMoving, moveCharacter]);

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

    const handleDateClick = useCallback(() => {
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
            setIsPlayingAnimation(true);
            // setIsMoving(false);
            setIsCharacterMoving(false);
        } else {
            setIsPlayingAnimation(!isPlayingAnimation);
            if (!isPlayingAnimation) {
                // 재생 버튼을 눌렀을 때 즉시 이동 시작
                if (autoPlayTimeoutRef.current) {
                    clearTimeout(autoPlayTimeoutRef.current);
                }
                moveCharacter();
            }
        }
    }, [currentPinIndex, pinPoints, isPlayingAnimation, moveCharacter]);

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
        setSelectedMarker(null);
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
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
    }

    if (!isLoaded || isLoading) {
        return <Spinner />;
    }

    const renderControls = () => {
        if (showDetailedView) {
            return (
                <>
                    {!isCharacterMoving && (
                        <button css={controlButtonStyle} onClick={togglePlayPause}>
                            {isPlayingAnimation ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                    )}
                    {!isCharacterMoving && (
                        <div css={imageByDateButton} onClick={handleDateClick}>
                            <h2 css={textStyle}>날짜별로 사진보기</h2>
                            <ChevronUp size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
                        </div>
                    )}
                </>
            );
        } else {
            return (
                <div css={controlButtonStyle} onClick={handleHomeClick}>
                    <BsPersonWalking />
                </div>
            );
        }
    };

    const renderPolyline = () => {
        if (pinPoints.length < 2) return null;

        const path = pinPoints.map((point) => ({ lat: point.latitude, lng: point.longitude }));

        return <Polyline path={path} options={POLYLINE_OPTIONS} />;
    };

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
                                getPixelPositionOffset={getPhotoCardOffset}
                            >
                                <div
                                    css={photoCardStyle(index === currentPinIndex && !isCharacterMoving)}
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
                    {selectedMarker && isMapLoaded && renderPhotoCard(selectedMarker)}
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
        <div css={pageContainer(isTransitioning)}>
            <Header title={tripInfo?.tripTitle || ''} isBackButton onBack={() => navigate(PATH.TRIPS.ROOT)} />
            <div css={mapWrapper}>
                <GoogleMap
                    zoom={INITIAL_ZOOM_SCALE}
                    center={characterPosition || undefined}
                    options={{
                        ...GOOGLE_MAPS_OPTIONS,
                        draggable: isMapInteractive,
                        scrollwheel: isMapInteractive,
                    }}
                    mapContainerStyle={{ height: 'calc(100% + 30px)' }}
                    onLoad={handleMapLoad}
                    onZoomChanged={handleZoomChanged}
                    onClick={() => setSelectedMarker(null)}
                >
                    {renderMarkers()}
                    {renderControls()}
                </GoogleMap>
            </div>
        </div>
    );
};

const pageContainer = (isTransitioning: boolean) => css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: ${isTransitioning ? 'translateY(-100%)' : 'translateY(0)'};
    overflow: hidden;
`;

const mapWrapper = css`
    flex-grow: 1;
`;

const imageByDateButton = css`
    position: absolute;
    bottom: 30px;
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

const textStyle = css`
    color: ${theme.colors.descriptionText};
    font-weight: bold;
`;

const controlButtonStyle = css`
    position: absolute;
    bottom: 94px;
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

const clusterPhotoCardStyle = css`
    background-color: ${theme.colors.white};
    border-radius: 50%;
    width: ${PHOTO_CARD_WIDTH}px;
    height: ${PHOTO_CARD_HEIGHT}px;
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
    border-radius: 50%;
`;

export default TimelineMapPage;
