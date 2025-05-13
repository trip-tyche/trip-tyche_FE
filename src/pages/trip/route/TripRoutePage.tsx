import React, { useCallback, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { MediaFile } from '@/domains/media/types';
import { filterValidLocationMediaFile, removeDuplicateDates } from '@/domains/media/utils';
import MapControlButtons from '@/domains/route/components/MapControlButtons';
import PhotoCard from '@/domains/route/components/PhotoCard';
import Polyline from '@/domains/route/components/Polyline';
import { ROUTE } from '@/domains/route/constants';
import { useRoute } from '@/domains/route/hooks/queries';
import { PinPoint } from '@/domains/route/types';
import { filterValidLocationPinPoint, sortPinPointByDate } from '@/domains/route/utils';
import Header from '@/shared/components/common/Header';
import Spinner from '@/shared/components/common/Spinner';
import Map from '@/shared/components/Map';
import CharacterMarker from '@/shared/components/map/CharacterMarker';
import ClusterMarker from '@/shared/components/map/ClusterMarker';
import Marker from '@/shared/components/map/Marker';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/paths';
import { MESSAGE } from '@/shared/constants/ui';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

interface TripRouteInfo {
    title: string;
    startDate: string;
    endDate: string;
    dates: string[];
    tripImages: MediaFile[];
}

const TripRoutePage = () => {
    const [tripRouteInfo, setTripRouteInfo] = useState<TripRouteInfo | null>(null);
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [characterPosition, setCharacterPosition] = useState<Location | null>(null);

    const [currentPinPointIndex, setCurrentPinPointIndex] = useState(0);
    const [selectedIndividualMarker, setSelectedIndividualMarker] = useState<MediaFile | null>(null);

    // const [zoom, setCurrentZoomScale] = useState(ZOOM_SCALE.DEFAULT.ROUTE);
    const [isMapInteractive, setIsMapInteractive] = useState(true);

    const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
    const [isCharacterMoving, setIsCharacterMoving] = useState(false);

    const [showSpinner, setShowSpinner] = useState(false);

    const { showToast } = useToastStore();
    const {
        mapRef,
        mapStatus,
        isMapScriptLoaded,
        isMapScriptLoadError,
        isMapRendered,
        handleMapRender,
        handleZoomChanged,
        updateMapCenter,
    } = useMapControl(ZOOM_SCALE.DEFAULT.ROUTE, characterPosition);

    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { tripKey } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const { data: result, isLoading } = useRoute(tripKey!);

    const isLastPinPoint = currentPinPointIndex === pinPoints.length - 1;

    useEffect(() => {
        if (result) {
            if (!result.success) {
                showToast(result?.error || MESSAGE.ERROR.UNKNOWN);
                navigate(ROUTES.PATH.MAIN);
                return;
            }

            const { tripTitle, startDate, endDate, pinPoints, mediaFiles: tripImages } = result.data;

            const validLocationPinPoints = sortPinPointByDate(filterValidLocationPinPoint(pinPoints));
            const validLocationImages = filterValidLocationMediaFile(tripImages);
            const isValidTrip = tripTitle && startDate && endDate && tripImages.length !== 0;
            const imageDates = validLocationImages.map((image: MediaFile) => image.recordDate.split('T')[0]);

            if (validLocationPinPoints.length === 0) {
                showToast('여행 경로를 표시할 수 있는 사진이 없습니다');
                navigate(ROUTES.PATH.MAIN);
                return;
            }

            if (!isValidTrip) {
                showToast('여행 정보가 올바르지 않아요. 정보를 다시 확인해주세요');
                navigate(ROUTES.PATH.MAIN);
                return;
            }

            const initialPinPointPosition = {
                latitude: validLocationPinPoints[0].latitude,
                longitude: validLocationPinPoints[0].longitude,
            };

            setPinPoints(validLocationPinPoints);
            setCharacterPosition(initialPinPointPosition);
            setTripRouteInfo({
                title: tripTitle,
                startDate,
                endDate,
                dates: removeDuplicateDates(imageDates),
                tripImages: validLocationImages,
            });
        }
    }, [result, navigate, showToast]);

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
        };
    }, []);

    // 슬라이드 페이지 갔다올 때 최근 핀포인트 확인
    useEffect(() => {
        if (pinPoints.length > 0 && state) {
            const currentPinPointId = state?.lastLoactedPinPointId;
            // const recentPinPointId = sessionStorage.getItem('recentPinPointId');

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

    // const moveCharacter = useCallback(() => {
    //     if (isLastPinPoint) {
    //         setIsPlayingAnimation(false);
    //         setIsCharacterMoving(false);
    //         setIsMapInteractive(true);
    //         return;
    //     }

    //     const start = pinPoints[currentPinPointIndex];
    //     const end = pinPoints[currentPinPointIndex + 1];
    //     setIsCharacterMoving(true);
    //     setIsMapInteractive(false); // 캐릭터 이동 시작 시 지도 조작 비활성화

    //     const animate = (time: number) => {
    //         if (!startTimeRef.current) startTimeRef.current = time;
    //         const progress = Math.min((time - startTimeRef.current) / 500, 1);
    //         // const progress = Math.min((time - startTimeRef.current) / ROUTE.DURATION.MOVE, 1);

    //         const newLat = start.latitude + (end.latitude - start.latitude) * progress;
    //         const newLng = start.longitude + (end.longitude - start.longitude) * progress;
    //         const newPosition = { latitude: newLat, longitude: newLng };
    //         setCharacterPosition(newPosition);

    //         if (mapRef.current) {
    //             updateMapCenter({ latitude: newPosition.latitude, longitude: newPosition.longitude }, true);

    //         }

    //         if (progress < 1) {
    //             animationRef.current = requestAnimationFrame(animate);
    //         } else {
    //             startTimeRef.current = null;
    //             setCurrentPinPointIndex((prev) => prev + 1);
    //             setIsCharacterMoving(false);
    //             setIsMapInteractive(true);

    //             autoPlayTimeoutRef.current = setTimeout(() => {
    //                 if (isPlayingAnimation) {
    //                     moveCharacter();
    //                 }
    //             }, ROUTE.DURATION.WAIT);
    //         }
    //     };

    //     animationRef.current = requestAnimationFrame(animate);
    // }, [currentPinPointIndex, pinPoints, isPlayingAnimation, isLastPinPoint]);

    // 재생 버튼을 눌렀을 때 캐릭터가 각 위치에서 잠시 멈췄다가 자동으로 다음 위치로 이동하는 자동 재생 기능

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
        setIsMapInteractive(false);

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
            const R = 6371;
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) *
                    Math.cos(lat2 * (Math.PI / 180)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const distance = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
        console.log('distance', distance);
        const getDurationByDistance = (distanceKm: number): number => {
            if (distanceKm < 1) {
                return 1000;
            } else if (distanceKm < 5) {
                return 3000;
            } else if (distanceKm < 10) {
                return 5000;
            } else {
                setShowSpinner(true);
                setTimeout(() => setShowSpinner(false), 1500);
                return 100;
            }
        };

        const moveDuration = getDurationByDistance(distance);

        if (distance >= 10) {
            setShowSpinner(true);

            setTimeout(() => {
                setCharacterPosition({ latitude: end.latitude, longitude: end.longitude });
                if (mapRef.current) {
                    updateMapCenter({ latitude: end.latitude, longitude: end.longitude }, true);
                }

                setShowSpinner(false);
                setCurrentPinPointIndex((prev) => prev + 1);
                setIsCharacterMoving(false);
                setIsMapInteractive(true);

                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isPlayingAnimation) {
                        moveCharacter();
                    }
                }, ROUTE.DURATION.WAIT);
            }, 1500);

            return;
        }

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / moveDuration, 1);

            const newLat = start.latitude + (end.latitude - start.latitude) * progress;
            const newLng = start.longitude + (end.longitude - start.longitude) * progress;
            const newPosition = { latitude: newLat, longitude: newLng };
            console.log(newPosition);
            setCharacterPosition(newPosition);

            if (mapRef.current) {
                updateMapCenter({ latitude: newPosition.latitude, longitude: newPosition.longitude }, true);
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
            mapRef.current.setZoom(ZOOM_SCALE.DEFAULT.ROUTE);
            // 지도 중심을 캐릭터 위치로 이동
            if (characterPosition) {
                updateMapCenter({ latitude: characterPosition.latitude, longitude: characterPosition.longitude });
            }
        }
    }, [characterPosition]);

    const handleImageByDateButtonClick = useCallback(() => {
        if (!tripRouteInfo) return;

        const pinPointId = String(pinPoints[currentPinPointIndex].pinPointId);
        navigate(`${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_DATE(tripKey as string, tripRouteInfo.startDate)}`, {
            state: { startDate: tripRouteInfo.startDate, imagesByDates: tripRouteInfo?.dates, pinPointId },
        });
    }, [tripKey, tripRouteInfo, pinPoints, currentPinPointIndex, navigate]);

    const handleIndividualMarkerClick = (marker: MediaFile) => {
        if (mapRef.current) {
            updateMapCenter({ latitude: marker.latitude, longitude: marker.longitude }, true);
        }
        setSelectedIndividualMarker(marker);
    };

    const togglePlayingButton = useCallback(() => {
        if (isLastPinPoint) {
            const initialPinPointPosition = {
                latitude: pinPoints[0].latitude,
                longitude: pinPoints[0].longitude,
            };

            setCurrentPinPointIndex(0);
            setCharacterPosition(initialPinPointPosition);
            updateMapCenter(
                { latitude: initialPinPointPosition.latitude, longitude: initialPinPointPosition.longitude },
                true,
            );
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

    const showCharacterView = mapStatus.zoom === ZOOM_SCALE.DEFAULT.ROUTE;
    const showIndividualImageMarkers = mapStatus.zoom >= ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE;

    if (isMapScriptLoadError) {
        showToast('지도를 불러오는데 실패했습니다');
        navigate(ROUTES.PATH.MAIN);
        return;
    }
    const isPhotoCardVisible = (photoCardIndex: number) =>
        Boolean(photoCardIndex === currentPinPointIndex && !isCharacterMoving);

    const renderMarkers = () => {
        if (showCharacterView) {
            return (
                <>
                    {/* TODO: 컴포넌트 분리 및 useCallback, useMemo 사용 */}
                    {pinPoints.map((point, index) => (
                        <React.Fragment key={point.pinPointId}>
                            <Marker
                                position={{ latitude: point.latitude, longitude: point.longitude }}
                                isMapRendered={isMapRendered}
                                isVisible={
                                    !(
                                        characterPosition?.latitude === point.latitude &&
                                        characterPosition?.longitude === point.longitude
                                    )
                                }
                            />
                            <PhotoCard
                                position={{
                                    latitude: characterPosition?.latitude || 0,
                                    longitude: characterPosition?.longitude || 0,
                                }}
                                image={point.mediaLink}
                                heightOffset={80}
                                isVisible={isPhotoCardVisible(index)}
                                onClick={() =>
                                    navigate(`${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_PINPOINT(tripKey!, point.pinPointId)}`)
                                }
                            />
                        </React.Fragment>
                    ))}
                    {characterPosition && (
                        <CharacterMarker
                            position={{
                                latitude: characterPosition?.latitude,
                                longitude: characterPosition?.longitude,
                            }}
                            isMapRendered={isMapRendered}
                        />
                    )}
                </>
            );
        } else if (showIndividualImageMarkers) {
            return (
                <>
                    {/* TODO: 컴포넌트 분리 및 useCallback, useMemo 사용 */}
                    {tripRouteInfo?.tripImages.map((image) => {
                        return (
                            <Marker
                                key={image.mediaFileId}
                                isClick={!!(image.mediaFileId === selectedIndividualMarker?.mediaFileId)}
                                position={{ latitude: image.latitude, longitude: image.longitude }}
                                isMapRendered={isMapRendered}
                                isIndividualImageMarker
                                onClick={() => handleIndividualMarkerClick(image)}
                            />
                        );
                    })}
                    {selectedIndividualMarker && (
                        <PhotoCard
                            position={selectedIndividualMarker}
                            image={selectedIndividualMarker.mediaLink}
                            heightOffset={55}
                            isVisible={!!selectedIndividualMarker}
                        />
                    )}
                </>
            );
        } else {
            return <ClusterMarker mapRef={mapRef} images={tripRouteInfo?.tripImages || []} />;
        }
    };

    if (!isMapScriptLoaded || isLoading) {
        return <Spinner />;
    }

    return (
        <div css={container}>
            {showSpinner && <Spinner text='장거리 이동 중...' />}
            <Header title={tripRouteInfo?.title || ''} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />

            <Map
                zoom={mapStatus.zoom}
                center={mapStatus.center || DEFAULT_CENTER}
                isInteractive={isMapInteractive}
                onLoad={handleMapRender}
                onZoomChanged={() => {
                    handleZoomChanged(() => setSelectedIndividualMarker(null));
                    updateMapCenter({
                        latitude: mapRef.current?.getCenter()?.lat() || 0,
                        longitude: mapRef.current?.getCenter()?.lng() || 0,
                    });
                }}
                onClick={() => {
                    setSelectedIndividualMarker(null);
                    updateMapCenter({
                        latitude: mapRef.current?.getCenter()?.lat() || 0,
                        longitude: mapRef.current?.getCenter()?.lng() || 0,
                    });
                }}
            >
                <>
                    <Polyline pinPoints={pinPoints} isCharacterVisible={showCharacterView} />
                    {renderMarkers()}
                    <MapControlButtons
                        isVisible={!isCharacterMoving}
                        isCharacterView={showCharacterView}
                        isLastPinPoint={isLastPinPoint}
                        isCharacterPlaying={isPlayingAnimation}
                        handler={{
                            handleDateViewClick: handleImageByDateButtonClick,
                            handleCharacterViewClick: handleShowCharacterViewButtonClick,
                            handleCharacterPlayToggle: togglePlayingButton,
                        }}
                    />
                </>
            </Map>
        </div>
    );
};

const container = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
`;

export default TripRoutePage;
