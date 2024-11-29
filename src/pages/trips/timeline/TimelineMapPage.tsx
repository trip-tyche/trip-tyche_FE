import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { GoogleMap, Marker, OverlayView, MarkerClusterer, Polyline } from '@react-google-maps/api';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { BsPersonWalking } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import {
    CHARACTER_ICON_CONFIG,
    DEFAULT_ZOOM_SCALE,
    GOOGLE_MAPS_OPTIONS,
    MARKER_CLUSTER_OPTIONS,
    POLYLINE_OPTIONS,
} from '@/constants/googleMaps';
import { PATH } from '@/constants/path';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import useTimelineStore from '@/stores/useTimelineStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { LatLngLiteralType, MapsType } from '@/types/googleMaps';
import { BaseLocationMedia, MediaFile, PinPoint, TripInfoModel } from '@/types/trip';

const MOVE_DURATION = 3000;
const WAIT_DURATION = 3000;

const PHOTO_CARD_WIDTH = 100;
const PHOTO_CARD_HEIGHT = 100;

const INDIVIDUAL_MARKER_ZOOM = 17;
const TimelineMapPage = () => {
    console.log('Re-Rendering Count');
    const [tripInfo, setTripInfo] = useState<TripInfoModel>();
    const [pinPointsInfo, setPinPointsInfo] = useState<PinPoint[]>([]);
    const [tripImages, setTripImages] = useState<MediaFile[]>([]);

    const [characterPosition, setCharacterPosition] = useState<LatLngLiteralType>();

    const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
    const [isCharacterMoving, setIsCharacterMoving] = useState(false);

    const [currentPinPointIndex, setCurrentPinPointIndex] = useState(0);
    const [selectedIndividualMarker, setSelectedIndividualMarker] = useState<BaseLocationMedia | null>(null);

    const [showPhotoCard, setShowPhotoCard] = useState(true);
    const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM_SCALE.TIMELINE);
    const [isMapInteractive, setIsMapInteractive] = useState(true);
    const [imageDates, setImageDates] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const { showToast } = useToastStore();
    const { lastPinPointId, setLastPinPointId } = useTimelineStore();

    const { isLoaded, loadError, markerIcon } = useGoogleMaps();

    const mapRef = useRef<MapsType | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const { tripId } = useParams();

    //  Google Maps가 처음 로드될 때 실행되는 핸들러 함수
    const handleMapLoad = (map: MapsType) => {
        mapRef.current = map;
        setIsMapLoaded(true); // 맵 로드 상태 변경

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
            y: -(PHOTO_CARD_HEIGHT + 80),
        };
    }, []);

    // 데이터 패칭
    useEffect(() => {
        const getTimelineMapData = async () => {
            if (!tripId) {
                return;
            }

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
            setTripImages(images);
            setImageDates(uniqueImageDates);
            setPinPointsInfo(sortedPinPointByDate);

            setCharacterPosition({ lat: sortedPinPointByDate[0].latitude, lng: sortedPinPointByDate[0].longitude });
            setIsPlayingAnimation(false);
            setIsCharacterMoving(false);
        };

        setIsLoading(true);
        getTimelineMapData();
        setIsLoading(false);

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            setLastPinPointId(undefined);
            localStorage.removeItem('lastPinPointId');
        };
    }, []);

    // 슬라이드 페이지 갔다올 때 최근 핀포인트 확인
    useEffect(() => {
        if (pinPointsInfo.length > 0) {
            const currentPinPointId = lastPinPointId || localStorage.getItem('lastPinPointId');

            if (currentPinPointId) {
                const startPinPointIndex = pinPointsInfo.findIndex(
                    (pinPoint) => String(pinPoint.pinPointId) === currentPinPointId,
                );
                if (startPinPointIndex !== -1) {
                    setCurrentPinPointIndex(startPinPointIndex);
                    setCharacterPosition({
                        lat: pinPointsInfo[startPinPointIndex].latitude,
                        lng: pinPointsInfo[startPinPointIndex].longitude,
                    });
                }
                setLastPinPointId(undefined);
                localStorage.removeItem('lastPinPointId');
            }
        }
    }, [pinPointsInfo, lastPinPointId]);

    const moveCharacter = useCallback(() => {
        if (currentPinPointIndex >= pinPointsInfo.length - 1) {
            setIsPlayingAnimation(false);
            // setIsMoving(false);
            setIsCharacterMoving(false);
            setIsMapInteractive(true);
            return;
        }

        const start = pinPointsInfo[currentPinPointIndex];
        const end = pinPointsInfo[currentPinPointIndex + 1];
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
                setCurrentPinPointIndex((prev) => prev + 1);
                setShowPhotoCard(true);
                // setIsMoving(false);
                setIsCharacterMoving(false);
                setIsMapInteractive(true);

                // 새로운 핀포인트 위치로 포토카드 위치 업데이트
                // setPhotoCardPosition({ lat: end.latitude, lng: end.longitude });

                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isPlayingAnimation) {
                        moveCharacter();
                    }
                }, WAIT_DURATION);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinPointIndex, pinPointsInfo, isPlayingAnimation]);

    // 재생 버튼을 눌렀을 때 캐릭터가 각 위치에서 잠시 멈췄다가 자동으로 다음 위치로 이동하는 자동 재생 기능
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

    const togglePlayPause = useCallback(() => {
        if (currentPinPointIndex === pinPointsInfo.length - 1) {
            // 마지막 핀포인트에서 처음으로 돌아가기
            setCurrentPinPointIndex(0);
            setCharacterPosition({ lat: pinPointsInfo[0].latitude, lng: pinPointsInfo[0].longitude });
            if (mapRef.current) {
                mapRef.current.panTo({ lat: pinPointsInfo[0].latitude, lng: pinPointsInfo[0].longitude });
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
    }, [currentPinPointIndex, pinPointsInfo, isPlayingAnimation, moveCharacter]);

    const clusterOptions = useMemo(
        () => ({
            ...MARKER_CLUSTER_OPTIONS,
            onClick: (cluster: any, _markers: any) => {
                if (mapRef.current) {
                    const currentZoom = mapRef.current.getZoom() || 0;
                    const newZoom = Math.min(currentZoom + 3, INDIVIDUAL_MARKER_ZOOM - 1);
                    mapRef.current.setZoom(newZoom);
                    mapRef.current.panTo(cluster.getCenter());
                }
            },
        }),
        [],
    );

    const characterIcon = useMemo(() => {
        if (isLoaded) {
            return {
                url: CHARACTER_ICON_CONFIG.url,
                scaledSize: new window.google.maps.Size(
                    CHARACTER_ICON_CONFIG.scaledSize.width,
                    CHARACTER_ICON_CONFIG.scaledSize.height,
                ),
                anchor: new window.google.maps.Point(
                    CHARACTER_ICON_CONFIG.anchorPoint.x,
                    CHARACTER_ICON_CONFIG.anchorPoint.y,
                ),
            };
        }
        return null;
    }, [isLoaded]);

    const showDetailedView = currentZoom === DEFAULT_ZOOM_SCALE.TIMELINE;
    const showIndividualMarkers = currentZoom >= INDIVIDUAL_MARKER_ZOOM;

    const handleShowCharacterViewButtonClick = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.setZoom(DEFAULT_ZOOM_SCALE.TIMELINE);
            // 지도 중심을 캐릭터 위치로 이동
            if (characterPosition) {
                mapRef.current.panTo(characterPosition);
            }
        }
    }, [characterPosition]);

    const handleImageByDateButtonClick = useCallback(() => {
        navigate(`${PATH.TRIPS.TIMELINE.DATE(Number(tripId))}`, { state: imageDates });
    }, [tripId, imageDates, navigate]);

    const handleIndividualMarkerClick = (marker: BaseLocationMedia) => {
        setSelectedIndividualMarker(marker);
        if (mapRef.current) {
            mapRef.current.panTo({ lat: marker.latitude, lng: marker.longitude });
        }
    };

    const handleZoomChanged = () => {
        setSelectedIndividualMarker(null);
        if (mapRef.current) {
            const newZoom = mapRef.current.getZoom();
            if (newZoom !== undefined) {
                setCurrentZoom(newZoom);
            }
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
                        <div css={imageByDateButton} onClick={handleImageByDateButtonClick}>
                            <h2 css={textStyle}>날짜별로 사진보기</h2>
                            <ChevronUp size={20} color={`${theme.colors.descriptionText}`} strokeWidth={2.5} />
                        </div>
                    )}
                </>
            );
        } else {
            return (
                <div css={controlButtonStyle} onClick={handleShowCharacterViewButtonClick}>
                    <BsPersonWalking />
                </div>
            );
        }
    };

    const renderPolyline = () => {
        if (pinPointsInfo.length < 2) return null;

        const path = pinPointsInfo.map((point) => ({ lat: point.latitude, lng: point.longitude }));

        return <Polyline path={path} options={POLYLINE_OPTIONS} />;
    };

    const renderPhotoCard = (marker: BaseLocationMedia) => (
        <OverlayView
            position={{ lat: marker.latitude, lng: marker.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(_width, _height) => ({
                x: -(PHOTO_CARD_WIDTH / 2),
                y: -(PHOTO_CARD_HEIGHT + 45),
            })}
        >
            <div css={clusterPhotoCardStyle}>
                <img css={imageStyle} src={marker.mediaLink} alt='포토 카드' />
            </div>
        </OverlayView>
    );

    const renderMarkers = () => {
        if (showDetailedView) {
            return (
                <>
                    {renderPolyline()}
                    {pinPointsInfo.map((point, index) => (
                        <React.Fragment key={point.pinPointId}>
                            <Marker
                                position={{ lat: point.latitude, lng: point.longitude }}
                                icon={markerIcon || undefined}
                            />
                            <OverlayView
                                position={characterPosition || undefined}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                getPixelPositionOffset={getPhotoCardOffset}
                            >
                                <div
                                    css={photoCardStyle(index === currentPinPointIndex && !isCharacterMoving)}
                                    onClick={() =>
                                        navigate(`${PATH.TRIPS.TIMELINE.PINPOINT(Number(tripId), point.pinPointId)}`)
                                    }
                                >
                                    <img css={imageStyle} src={point.mediaLink} alt='포토카드 이미지' />
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
                    {tripImages.map((image) => (
                        <Marker
                            key={image.mediaFileId}
                            position={{ lat: image.latitude, lng: image.longitude }}
                            icon={markerIcon || undefined}
                            onClick={() => handleIndividualMarkerClick(image)}
                        />
                    ))}
                    {selectedIndividualMarker && isMapLoaded && renderPhotoCard(selectedIndividualMarker)}
                </>
            );
        } else {
            return (
                <MarkerClusterer options={clusterOptions}>
                    {(clusterer) => (
                        <>
                            {renderPolyline()}
                            {tripImages.map((image) => (
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
        <div css={pageContainer}>
            <Header title={tripInfo?.tripTitle || ''} isBackButton onBack={() => navigate(PATH.TRIPS.ROOT)} />
            <div css={mapWrapper}>
                <GoogleMap
                    zoom={DEFAULT_ZOOM_SCALE.TIMELINE}
                    center={characterPosition || undefined}
                    options={{
                        ...GOOGLE_MAPS_OPTIONS,
                        draggable: isMapInteractive,
                        scrollwheel: isMapInteractive,
                    }}
                    mapContainerStyle={{ height: 'calc(100% + 30px)' }}
                    onLoad={handleMapLoad}
                    onZoomChanged={handleZoomChanged}
                    onClick={() => setSelectedIndividualMarker(null)}
                >
                    {renderMarkers()}
                    {renderControls()}
                </GoogleMap>
            </div>
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
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
    border-radius: 30%;
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
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
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
    border-radius: 30%;
`;

export default TimelineMapPage;
