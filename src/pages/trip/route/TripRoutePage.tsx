import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { Marker, OverlayView, MarkerClusterer, Polyline } from '@react-google-maps/api';
import { Play, Pause } from 'lucide-react';
import { BsPersonWalking } from 'react-icons/bs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { MediaFile } from '@/domains/media/types';
import { filterValidLocationMediaFile, removeDuplicateDates } from '@/domains/media/utils';
import PhotoCard from '@/domains/route/components/PhotoCard';
import { ROUTE } from '@/domains/route/constants';
import { PinPoint } from '@/domains/route/types';
import { filterValidLocationPinPoint, sortPinPointByDate } from '@/domains/route/utils';
import { routeAPI } from '@/libs/apis';
import { getPixelPositionOffset } from '@/libs/utils/map';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import Spinner from '@/shared/components/common/Spinner';
import Map from '@/shared/components/Map';
import { DEFAULT_CENTER, DEFAULT_ZOOM_SCALE, MARKER_CLUSTER_OPTIONS } from '@/shared/constants/maps/config';
import { CHARACTER_ICON_CONFIG, POLYLINE_OPTIONS } from '@/shared/constants/maps/styles';
import { ROUTES } from '@/shared/constants/paths';
import { MAP } from '@/shared/constants/ui';
import { useGoogleMaps } from '@/shared/hooks/useGoogleMaps';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { Location, MapType } from '@/shared/types/map';

const TripRoutePage = () => {
    const [tripTitle, setTripTitle] = useState();
    const [startDate, setStartDate] = useState('');
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [tripImages, setTripImages] = useState<MediaFile[]>([]);
    const [characterPosition, setCharacterPosition] = useState<Location>();

    const [currentPinPointIndex, setCurrentPinPointIndex] = useState(0);
    const [selectedIndividualMarker, setSelectedIndividualMarker] = useState<MediaFile | null>(null);

    const [currentZoomScale, setCurrentZoomScale] = useState(DEFAULT_ZOOM_SCALE.TIMELINE);
    const [isMapInteractive, setIsMapInteractive] = useState(true);
    const [imagesByDates, setImagesByDates] = useState<string[]>([]);

    const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
    const [isCharacterMoving, setIsCharacterMoving] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { showToast } = useToastStore();

    const { isLoaded, loadError, markerIcon } = useGoogleMaps();

    const mapRef = useRef<MapType | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { tripKey } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const isLastPinPoint = currentPinPointIndex === pinPoints.length - 1;

    useEffect(() => {
        const getTimelineMapData = async () => {
            if (!tripKey) return;

            setIsLoading(true);
            const { tripTitle, startDate, pinPoints, mediaFiles: images } = await routeAPI.fetchTripRoute(tripKey);

            const validLocationPinPoints = sortPinPointByDate(filterValidLocationPinPoint(pinPoints));
            const validLocationImages = filterValidLocationMediaFile(images);

            const imageDates = validLocationImages.map((image: MediaFile) => image.recordDate.split('T')[0]);

            if (validLocationPinPoints.length === 0) {
                showToast('여행에 등록된 사진이 없습니다');
                navigate(ROUTES.PATH.MAIN);
                return;
            }

            const firstPinPointLocation = {
                latitude: validLocationPinPoints[0].latitude,
                longitude: validLocationPinPoints[0].longitude,
            };

            setStartDate(startDate);
            setTripTitle(tripTitle);

            setImagesByDates(removeDuplicateDates(imageDates));

            setTripImages(validLocationImages);
            setPinPoints(validLocationPinPoints);

            setCharacterPosition(firstPinPointLocation);
            setIsLoading(false);
        };

        getTimelineMapData();
    }, []);

    useEffect(() => {
        setIsPlayingAnimation(false);
        setIsCharacterMoving(false);

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            localStorage.removeItem('lastLoactedPinPointId');
        };
    }, []);

    // 슬라이드 페이지 갔다올 때 최근 핀포인트 확인
    useEffect(() => {
        if (pinPoints.length > 0 && state) {
            const currentPinPointId = state?.lastLoactedPinPointId;

            if (currentPinPointId) {
                const startPinPointIndex = pinPoints.findIndex(
                    (pinPoint) => String(pinPoint.pinPointId) === currentPinPointId,
                );
                if (startPinPointIndex !== -1) {
                    setCurrentPinPointIndex(startPinPointIndex);
                    setCharacterPosition({
                        latitude: pinPoints[startPinPointIndex].latitude,
                        longitude: pinPoints[startPinPointIndex].longitude,
                    });
                }
            }
        }
    }, [pinPoints, state]);

    const moveCharacter = useCallback(() => {
        if (isLastPinPoint) {
            setIsPlayingAnimation(false);
            setIsCharacterMoving(false);
            setIsMapInteractive(true);
            return;
        }

        const start = pinPoints[currentPinPointIndex];
        const end = pinPoints[currentPinPointIndex + 1];
        setIsCharacterMoving(true);
        setIsMapInteractive(false); // 캐릭터 이동 시작 시 지도 조작 비활성화

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / ROUTE.DURATION.MOVE, 1);

            const newLat = start.latitude + (end.latitude - start.latitude) * progress;
            const newLng = start.longitude + (end.longitude - start.longitude) * progress;
            const newPosition = { latitude: newLat, longitude: newLng };
            setCharacterPosition(newPosition);

            if (mapRef.current) {
                mapRef.current.panTo({ lat: newPosition.latitude, lng: newPosition.longitude });
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
                }, ROUTE.DURATION.WAIT);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinPointIndex, pinPoints, isPlayingAnimation, isLastPinPoint]);

    // 재생 버튼을 눌렀을 때 캐릭터가 각 위치에서 잠시 멈췄다가 자동으로 다음 위치로 이동하는 자동 재생 기능
    useEffect(() => {
        if (isPlayingAnimation && !isCharacterMoving) {
            autoPlayTimeoutRef.current = setTimeout(
                () => {
                    moveCharacter();
                },
                isLastPinPoint ? 0 : ROUTE.DURATION.WAIT,
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
                mapRef.current.panTo({ lat: characterPosition.latitude, lng: characterPosition.longitude });
            }
        }
    }, [characterPosition]);

    const handleImageByDateButtonClick = useCallback(() => {
        const pinPointId = String(pinPoints[currentPinPointIndex].pinPointId);
        navigate(`${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_DATE(tripKey as string, startDate)}`, {
            state: { startDate, imagesByDates, pinPointId },
        });
    }, [tripKey, startDate, imagesByDates, navigate, pinPoints, currentPinPointIndex]);

    const handleIndividualMarkerClick = (marker: MediaFile) => {
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
            const firstPinPointLocation = {
                latitude: pinPoints[0].latitude,
                longitude: pinPoints[0].longitude,
            };

            setCurrentPinPointIndex(0);
            setCharacterPosition(firstPinPointLocation);
            mapRef.current?.panTo({ lat: firstPinPointLocation.latitude, lng: firstPinPointLocation.longitude });
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
    }, [pinPoints, isPlayingAnimation, isLastPinPoint, moveCharacter]);

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
        navigate(ROUTES.PATH.MAIN);
        return;
    }

    if (!isLoaded || isLoading) {
        return <Spinner />;
    }

    const renderPolyline = () => {
        if (pinPoints.length < 2) {
            return null;
        }

        const path = pinPoints.map((pinPoint) => ({ lat: pinPoint.latitude, lng: pinPoint.longitude }));

        return <Polyline path={path} options={POLYLINE_OPTIONS} />;
    };

    const renderMarkers = () => {
        if (showCharacterView) {
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
                                position={{
                                    lat: characterPosition?.latitude || 0,
                                    lng: characterPosition?.longitude || 0,
                                }}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                getPixelPositionOffset={() => getPixelPositionOffset(80)}
                            >
                                <div css={photoCardStyle(index === currentPinPointIndex && !isCharacterMoving)}>
                                    <img
                                        src={point.mediaLink}
                                        alt='포토카드 이미지'
                                        onClick={() =>
                                            navigate(
                                                `${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_PINPOINT(tripKey!, point.pinPointId)}`,
                                            )
                                        }
                                    />
                                </div>
                            </OverlayView>
                        </React.Fragment>
                    ))}
                    {characterPosition && (
                        <Marker
                            position={{
                                lat: characterPosition?.latitude || 0,
                                lng: characterPosition?.longitude || 0,
                            }}
                            icon={characterIcon || undefined}
                            zIndex={1000}
                        />
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
                    {isMapLoaded && selectedIndividualMarker && <PhotoCard marker={selectedIndividualMarker} />}
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
            !isCharacterMoving && (
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
                            icon={isLastPinPoint ? '' : isPlayingAnimation ? <Pause size={16} /> : <Play size={16} />}
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
            )
        );
    };

    const handleMapLoad = (map: MapType) => {
        if (!map) return;

        mapRef.current = map;
        setIsMapLoaded(true);
    };

    console.log('zxcvzxcv', characterPosition);

    return (
        <div css={pageContainer}>
            <Header title={tripTitle || ''} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <Map
                zoom={DEFAULT_ZOOM_SCALE.TIMELINE}
                center={characterPosition || DEFAULT_CENTER}
                isInteractive={isMapInteractive}
                onLoad={handleMapLoad}
                onZoomChanged={handleZoomChanged}
                onClick={() => setSelectedIndividualMarker(null)}
            >
                <>
                    {renderMarkers()}
                    {renderButtons()}
                </>
            </Map>
        </div>
    );
};

const pageContainer = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
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
    width: ${MAP.PHOTO_CARD_SIZE.WIDTH}px;
    height: ${MAP.PHOTO_CARD_SIZE.HEIGHT}px;
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
