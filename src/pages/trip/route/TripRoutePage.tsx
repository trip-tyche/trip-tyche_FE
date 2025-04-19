import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { GoogleMap, Marker, OverlayView, MarkerClusterer, Polyline } from '@react-google-maps/api';
import { Play, Pause } from 'lucide-react';
import { BsPersonWalking } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Spinner';
import { DEFAULT_ZOOM_SCALE, GOOGLE_MAPS_OPTIONS, MARKER_CLUSTER_OPTIONS, TIMELINE_MAP } from '@/constants/maps/config';
import { CHARACTER_ICON_CONFIG, POLYLINE_OPTIONS } from '@/constants/maps/styles';
import { ROUTES } from '@/constants/paths';
import { BaseLocationMedia, MediaFileModel, PinPointModel } from '@/domain/media/types';
// import { useTripTimeline } from '@/domain/route/hooks/queries';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { routeAPI } from '@/libs/apis';
import useTimelineStore from '@/stores/useTimelineStore';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { LatLng, Map } from '@/types/maps';

const TripRoutePage = () => {
    const [tripTitle, setTripTitle] = useState();
    const [pinPointsInfo, setPinPointsInfo] = useState<PinPointModel[]>([]);
    const [tripImages, setTripImages] = useState<MediaFileModel[]>([]);
    const [startDate, setStartDate] = useState('');

    const [characterPosition, setCharacterPosition] = useState<LatLng>();

    const [currentPinPointIndex, setCurrentPinPointIndex] = useState(0);
    const [selectedIndividualMarker, setSelectedIndividualMarker] = useState<BaseLocationMedia | null>(null);

    const [currentZoomScale, setCurrentZoomScale] = useState(DEFAULT_ZOOM_SCALE.TIMELINE);
    const [isMapInteractive, setIsMapInteractive] = useState(true);
    const [imagesByDates, setImagesByDates] = useState<string[]>([]);

    const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
    const [isCharacterMoving, setIsCharacterMoving] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { showToast } = useToastStore();
    const { lastPinPointId, setLastPinPointId } = useTimelineStore();

    const { isLoaded, loadError, markerIcon } = useGoogleMaps();

    const mapRef = useRef<Map | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const { tripKey } = useParams();

    const isLastPinPoint = currentPinPointIndex === pinPointsInfo.length - 1;

    //  Google Maps가 처음 로드될 때 실행되는 핸들러 함수
    const handleMapLoad = (map: Map) => {
        mapRef.current = map;
        setIsMapLoaded(true);
    };

    // const {
    //     data: { tripTitle, startDate, pinPoints, mediaFiles: images },
    // } = useTripTimeline(tripKey!);

    // 데이터 패칭
    useEffect(() => {
        const getTimelineMapData = async () => {
            if (!tripKey) {
                return;
            }

            const { tripTitle, startDate, pinPoints, mediaFiles: images } = await routeAPI.fetchTripRoute(tripKey);

            setStartDate(startDate);
            if (pinPoints.length === 0) {
                showToast('여행에 등록된 사진이 없습니다.');
                navigate(ROUTES.PATH.TRIP.ROOT);
                return;
            }

            const validLocationPinPoints = pinPoints.filter(
                (pinPoint: PinPointModel) => pinPoint.latitude !== 0 && pinPoint.longitude !== 0,
            );

            const sortedPinPointByDate = validLocationPinPoints.sort((a: PinPointModel, b: PinPointModel) => {
                return new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime();
            });

            const validLocationImages = images.filter(
                (image: MediaFileModel) => image.latitude !== 0 && image.longitude !== 0,
            );

            const imageDates = validLocationImages.map((image: MediaFileModel) => image.recordDate.split('T')[0]);

            const uniqueImageDates = [...new Set<string>([...imageDates])].sort((a, b) => a.localeCompare(b));

            setTripTitle(tripTitle);
            setTripImages(validLocationImages);
            setImagesByDates(uniqueImageDates);
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
        if (isLastPinPoint) {
            setIsPlayingAnimation(false);
            setIsCharacterMoving(false);
            setIsMapInteractive(true);
            return;
        }

        const start = pinPointsInfo[currentPinPointIndex];
        const end = pinPointsInfo[currentPinPointIndex + 1];
        setIsCharacterMoving(true);
        setIsMapInteractive(false); // 캐릭터 이동 시작 시 지도 조작 비활성화

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / TIMELINE_MAP.DURATION.MOVE, 1);

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
                setIsCharacterMoving(false);
                setIsMapInteractive(true);

                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isPlayingAnimation) {
                        moveCharacter();
                    }
                }, TIMELINE_MAP.DURATION.WAIT);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinPointIndex, pinPointsInfo, isPlayingAnimation, isLastPinPoint]);

    // 재생 버튼을 눌렀을 때 캐릭터가 각 위치에서 잠시 멈췄다가 자동으로 다음 위치로 이동하는 자동 재생 기능
    useEffect(() => {
        if (isPlayingAnimation && !isCharacterMoving) {
            autoPlayTimeoutRef.current = setTimeout(
                () => {
                    moveCharacter();
                },
                isLastPinPoint ? 0 : TIMELINE_MAP.DURATION.WAIT,
            );
        }

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, [isPlayingAnimation, isCharacterMoving, isLastPinPoint, moveCharacter]);

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
        const pinPointId = String(pinPointsInfo[currentPinPointIndex].pinPointId);
        navigate(`${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_DATE(tripKey as string, startDate)}`, {
            state: { startDate, imagesByDates, pinPointId },
        });
    }, [tripKey, startDate, imagesByDates, navigate, pinPointsInfo, currentPinPointIndex]);

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
                setCurrentZoomScale(newZoom);
            }
        }
    };

    const togglePlayingButton = useCallback(() => {
        if (isLastPinPoint) {
            const firstPinPointLocation = { lat: pinPointsInfo[0].latitude, lng: pinPointsInfo[0].longitude };

            setCurrentPinPointIndex(0);
            setCharacterPosition(firstPinPointLocation);
            mapRef.current?.panTo(firstPinPointLocation);
            setIsCharacterMoving(false);
        } else {
            setIsPlayingAnimation(!isPlayingAnimation);
            if (!isPlayingAnimation) {
                if (autoPlayTimeoutRef.current) {
                    clearTimeout(autoPlayTimeoutRef.current);
                }
                moveCharacter();
            }
        }
    }, [pinPointsInfo, isPlayingAnimation, isLastPinPoint, moveCharacter]);

    const calculatePhotoCardOffset = useCallback((height: number) => {
        const offset = {
            x: -TIMELINE_MAP.PHOTO_CARD.WIDTH / 2,
            y: -(TIMELINE_MAP.PHOTO_CARD.HEIGHT + height),
        };
        return offset;
    }, []);

    const clusterOptions = useMemo(
        () => ({
            ...MARKER_CLUSTER_OPTIONS,
            onClick: (cluster: any, _markers: any) => {
                if (mapRef.current) {
                    const currentZoom = mapRef.current.getZoom() || 0;
                    const newZoom = Math.min(currentZoom + 3, DEFAULT_ZOOM_SCALE.INDIVIDUAL_MARKER_VISIBLE - 1);
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

    const showCharacterView = currentZoomScale === DEFAULT_ZOOM_SCALE.TIMELINE;
    const showIndividualMarkers = currentZoomScale >= DEFAULT_ZOOM_SCALE.INDIVIDUAL_MARKER_VISIBLE;

    if (loadError) {
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
        navigate(ROUTES.PATH.TRIP.ROOT);
        return;
    }

    if (!isLoaded || isLoading) {
        return <Spinner />;
    }

    const renderPolyline = () => {
        if (pinPointsInfo.length < 2) {
            return null;
        }

        const path = pinPointsInfo.map((pinPoint) => ({ lat: pinPoint.latitude, lng: pinPoint.longitude }));

        return <Polyline path={path} options={POLYLINE_OPTIONS} />;
    };

    const renderPhotoCard = (marker: BaseLocationMedia) => (
        <OverlayView
            position={{ lat: marker.latitude, lng: marker.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={() => calculatePhotoCardOffset(50)}
        >
            <div css={basePhotoCardStyle}>
                <img src={marker.mediaLink} alt='포토카드 이미지' />
            </div>
        </OverlayView>
    );

    const renderMarkers = () => {
        if (showCharacterView) {
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
                                getPixelPositionOffset={() => calculatePhotoCardOffset(80)}
                            >
                                <div css={photoCardStyle(index === currentPinPointIndex && !isCharacterMoving)}>
                                    <img
                                        src={point.mediaLink}
                                        alt='포토카드 이미지'
                                        onClick={() =>
                                            navigate(
                                                `${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_PINPOINT(tripKey as string, point.pinPointId)}`,
                                            )
                                        }
                                    />
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
                    {tripImages.map((image) => (
                        <Marker
                            key={image.mediaFileId}
                            position={{ lat: image.latitude, lng: image.longitude }}
                            icon={markerIcon || undefined}
                            onClick={() => handleIndividualMarkerClick(image)}
                        />
                    ))}
                    {isMapLoaded && selectedIndividualMarker && renderPhotoCard(selectedIndividualMarker)}
                </>
            );
        } else {
            return (
                <MarkerClusterer options={clusterOptions}>
                    {(clusterer) => (
                        <>
                            {tripImages.map((image) => (
                                <Marker
                                    key={image.mediaFileId}
                                    position={{ lat: image.latitude, lng: image.longitude }}
                                    clusterer={clusterer}
                                    // icon={markerIcon || undefined}
                                />
                            ))}
                        </>
                    )}
                </MarkerClusterer>
            );
        }
    };

    const renderButtons = () => {
        return (
            <>
                {!isCharacterMoving && (
                    <div css={buttonGroup}>
                        <Button
                            text='날짜별 사진보기'
                            variant='white'
                            onClick={handleImageByDateButtonClick}
                            customStyle={customButtonStyle('white')}
                        />
                        {showCharacterView ? (
                            <Button
                                text={
                                    isLastPinPoint
                                        ? '첫 위치로 돌아가기'
                                        : isPlayingAnimation
                                          ? '캐릭터 움직임 멈추기'
                                          : '캐릭터 움직이기'
                                }
                                icon={
                                    isLastPinPoint ? '' : isPlayingAnimation ? <Pause size={16} /> : <Play size={16} />
                                }
                                onClick={togglePlayingButton}
                                customStyle={customButtonStyle()}
                            />
                        ) : (
                            <Button
                                text='캐릭터 화면에 표시'
                                icon={<BsPersonWalking size={16} />}
                                onClick={handleShowCharacterViewButtonClick}
                                customStyle={customButtonStyle()}
                            />
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <div css={pageContainer}>
            <Header title={tripTitle || ''} isBackButton onBack={() => navigate(ROUTES.PATH.TRIP.ROOT)} />
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
                    {renderButtons()}
                </GoogleMap>
            </div>
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const mapWrapper = css`
    flex-grow: 1;
`;

const buttonGroup = css`
    position: absolute;
    width: 100%;
    bottom: 30px;
    padding: 12px;
    display: flex;
    gap: 8px;
`;

const customButtonStyle = (variant: string = 'primary') => css`
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    color: ${variant === 'white' ? theme.COLORS.TEXT.DESCRIPTION : ''};
    font-weight: bold;
    transition: all 0.3s ease;
`;

const basePhotoCardStyle = css`
    background-color: ${theme.COLORS.TEXT.WHITE};
    width: ${TIMELINE_MAP.PHOTO_CARD.WIDTH}px;
    height: ${TIMELINE_MAP.PHOTO_CARD.HEIGHT}px;
    border-radius: 20%;
    padding: 1px;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;

    &:hover {
        transform: scale(1.05);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid white;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
            rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }

    img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 20%;
    }
`;

const photoCardStyle = (isCurrentPin: boolean) => css`
    ${basePhotoCardStyle}
    opacity: ${isCurrentPin ? 1 : 0};
    visibility: ${isCurrentPin ? 'visible' : 'hidden'};
    pointer-events: ${isCurrentPin ? 'auto' : 'none'};
`;

export default TripRoutePage;
