import React, { useCallback, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import { MediaFile } from '@/domains/media/types';
import { filterValidLocationMediaFile, removeDuplicateDates } from '@/domains/media/utils';
import MapControlButtons from '@/domains/route/components/MapControlButtons';
import PhotoCard from '@/domains/route/components/PhotoCard';
import Polyline from '@/domains/route/components/Polyline';
import { ROUTE } from '@/domains/route/constants';
import { useRoute } from '@/domains/route/hooks/queries';
import { PinPoint } from '@/domains/route/types';
import {
    calculateDistance,
    filterValidLocationPinPoint,
    getAnimationConfig,
    sortPinPointByDate,
} from '@/domains/route/utils';
import Header from '@/shared/components/common/Header';
import Spinner from '@/shared/components/common/Spinner';
import Map from '@/shared/components/Map';
import CharacterMarker from '@/shared/components/map/CharacterMarker';
import ClusterMarker from '@/shared/components/map/ClusterMarker';
import Marker from '@/shared/components/map/Marker';
import { ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/paths';
import { COLORS } from '@/shared/constants/theme';
import { MESSAGE } from '@/shared/constants/ui';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

interface TripRouteInfo {
    title: string;
    startDate: string;
    endDate: string;
    imageDates: string[];
    tripImages: MediaFile[];
}

const TripRoutePage = () => {
    const [tripRouteInfo, setTripRouteInfo] = useState<TripRouteInfo | null>(null);
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [characterPosition, setCharacterPosition] = useState<Location | null>(null);

    const [currentPinPointIndex, setCurrentPinPointIndex] = useState(0);
    const [selectedIndividualMarker, setSelectedIndividualMarker] = useState<MediaFile | null>(null);

    const [isMapInteractive, setIsMapInteractive] = useState(true);
    const [isCharacterMoving, setIsCharacterMoving] = useState(false);
    const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);

    const [currentTransportType, setCurrentTransportType] = useState('walking');
    const [showTravelMessage, setShowTravelMessage] = useState('');

    const { showToast } = useToastStore();
    const {
        mapRef,
        mapStatus,
        isMapScriptLoaded,
        isMapScriptLoadError,
        isMapRendered,
        handleMapRender,
        handleMapZoomChanged,
        updateMapCenter,
        updateMapZoom,
    } = useMapControl(ZOOM_SCALE.DEFAULT.ROUTE, characterPosition);

    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { tripKey } = useParams();
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
                imageDates: removeDuplicateDates(imageDates),
                tripImages: validLocationImages,
            });
        }
    }, [result]);

    useEffect(() => {
        if (pinPoints.length > 0) {
            const recentPinPointId = sessionStorage.getItem('recentPinPointId');
            if (recentPinPointId) {
                const recentPinPointIndex = pinPoints.findIndex(
                    (pinPoint) => String(pinPoint.pinPointId) === recentPinPointId,
                );
                if (recentPinPointIndex !== -1) {
                    setCurrentPinPointIndex(recentPinPointIndex);
                    setCharacterPosition({
                        latitude: pinPoints[recentPinPointIndex].latitude,
                        longitude: pinPoints[recentPinPointIndex].longitude,
                    });
                }
            }
        }
    }, [pinPoints]);

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
        console.time('calculate-distance');
        const distance = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
        console.timeEnd('calculate-distance');

        const settings = getAnimationConfig(distance);

        updateMapZoom(settings.zoomLevel);
        setCurrentTransportType(settings.transportType);
        setShowTravelMessage(
            distance >= 1 ? `${Math.round(distance).toLocaleString()}km 이동 중...` : '짧은 거리 이동 중...',
        );

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;

            // 단순 선형 진행 (가속/감속 없음)
            const progress = Math.min((time - startTimeRef.current) / settings.duration, 1);

            // 좌표 계산 - 직선 보간법 사용
            const newLat = start.latitude + (end.latitude - start.latitude) * progress;
            const newLng = start.longitude + (end.longitude - start.longitude) * progress;
            const newPosition = { latitude: newLat, longitude: newLng };

            // 캐릭터 위치 업데이트
            setCharacterPosition(newPosition);

            // 지도 중심 업데이트 - 캐릭터 따라가기
            if (mapRef.current) {
                updateMapCenter({ latitude: newPosition.latitude, longitude: newPosition.longitude });
            }

            if (progress < 1) {
                // 애니메이션 계속
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // 애니메이션 종료
                startTimeRef.current = null;
                setCurrentPinPointIndex((prev) => prev + 1);
                setIsCharacterMoving(false);
                setIsMapInteractive(true);
                setShowTravelMessage('');

                // 기본 이동 수단으로 복귀
                setCurrentTransportType('walking');

                // 이동 완료 후 기본 줌 레벨로 복원
                setTimeout(() => {
                    updateMapZoom(ZOOM_SCALE.DEFAULT.ROUTE);
                }, 300);

                // 자동 재생 중이면 다음 위치로 이동
                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isPlayingAnimation) {
                        moveCharacter();
                    }
                }, ROUTE.DURATION.WAIT);
            }
        };

        // 애니메이션 시작
        animationRef.current = requestAnimationFrame(animate);
    }, [mapRef, currentPinPointIndex, pinPoints, isPlayingAnimation, isLastPinPoint, updateMapCenter, updateMapZoom]);

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

    const handleIndividualMarkerClick = (marker: MediaFile) => {
        if (mapRef.current) {
            updateMapCenter({ latitude: marker.latitude, longitude: marker.longitude });
        }
        setSelectedIndividualMarker(marker);
    };

    const showCharacterView = useCallback(() => {
        if (mapRef.current) {
            if (characterPosition) {
                updateMapCenter({ latitude: characterPosition.latitude, longitude: characterPosition.longitude });
            }
            updateMapZoom(ZOOM_SCALE.DEFAULT.ROUTE);
        }
    }, [mapRef, characterPosition, updateMapCenter, updateMapZoom]);

    const handleZoomChanged = () => {
        handleMapZoomChanged(() => {
            if (mapStatus.zoom < ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE) {
                setSelectedIndividualMarker(null);
            }
        });

        updateMapCenter({
            latitude: mapRef.current?.getCenter()?.lat() || 0,
            longitude: mapRef.current?.getCenter()?.lng() || 0,
        });
    };

    const handleMapClick = () => {
        setSelectedIndividualMarker(null);

        updateMapCenter({
            latitude: mapRef.current?.getCenter()?.lat() || 0,
            longitude: mapRef.current?.getCenter()?.lng() || 0,
        });
    };

    const togglePlayingAnimation = useCallback(() => {
        if (isLastPinPoint) {
            const initialPinPointPosition = { latitude: pinPoints[0].latitude, longitude: pinPoints[0].longitude };
            updateMapCenter({
                latitude: initialPinPointPosition.latitude,
                longitude: initialPinPointPosition.longitude,
            });
            setCurrentPinPointIndex(0);
            setCharacterPosition(initialPinPointPosition);
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
    }, [pinPoints, isPlayingAnimation, isLastPinPoint, moveCharacter, updateMapCenter]);

    const navigateImagesByDatePage = useCallback(() => {
        const { startDate, endDate, imageDates } = tripRouteInfo || {};
        if (!startDate || !imageDates) return;

        const recentPinPointId = String(pinPoints[currentPinPointIndex].pinPointId);
        sessionStorage.setItem('recentPinPointId', recentPinPointId);

        // const initialDate = startDate === imageDates[0] ? startDate : imageDates[0];
        const defaultLocation = {
            latitude: tripRouteInfo?.tripImages[0].latitude,
            longitude: tripRouteInfo?.tripImages[0].longitude,
        };

        navigate(`${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_DATE(String(tripKey))}`, {
            state: { startDate, endDate, imageDates, defaultLocation },
        });
    }, [tripKey, tripRouteInfo, pinPoints, currentPinPointIndex, navigate]);

    const handlePinPointMarkClick = (position: PinPoint, index: number) => {
        setCharacterPosition(position);
        setCurrentPinPointIndex(index);
        setIsCharacterMoving(false);
        setIsPlayingAnimation(false);

        // TODO: 깜빡거림 현상 분석 (없으면 깜빡)
        updateMapCenter({
            latitude: mapRef.current?.getCenter()?.lat() || 0,
            longitude: mapRef.current?.getCenter()?.lng() || 0,
        });
    };

    const renderMarkers = () => {
        if (isCharacterVisible) {
            return (
                <>
                    {/* TODO: 컴포넌트 분리 및 useCallback, useMemo 사용 */}
                    {pinPoints.map((point, index) => {
                        // console.log(point);
                        return (
                            <React.Fragment key={point.pinPointId}>
                                <Marker
                                    mapRef={mapRef}
                                    position={{ latitude: point.latitude, longitude: point.longitude }}
                                    isMapRendered={isMapRendered}
                                    isVisible={!isPinPointOnCharacter(point)}
                                    onClick={() =>
                                        isCharacterMoving ? undefined : handlePinPointMarkClick(point, index)
                                    }
                                />
                                <PhotoCard
                                    position={{
                                        latitude: characterPosition?.latitude || 0,
                                        longitude: characterPosition?.longitude || 0,
                                    }}
                                    image={point.mediaLink}
                                    heightOffset={65}
                                    isVisible={isPhotoCardVisible(index)}
                                    onClick={() =>
                                        navigate(
                                            `${ROUTES.PATH.TRIP.ROUTE.IMAGE.BY_PINPOINT(tripKey!, point.pinPointId)}`,
                                        )
                                    }
                                />
                            </React.Fragment>
                        );
                    })}
                    {characterPosition && (
                        <CharacterMarker
                            position={{
                                latitude: characterPosition?.latitude,
                                longitude: characterPosition?.longitude,
                            }}
                            transportType={currentTransportType}
                            isMapRendered={isMapRendered}
                        />
                    )}
                    {showTravelMessage && <div css={travelMessageStyle}>{showTravelMessage}</div>}
                </>
            );
        } else if (isIndividualImageMarkersVisible) {
            return (
                <>
                    {/* TODO: 컴포넌트 분리 및 useCallback, useMemo 사용 */}
                    {tripRouteInfo?.tripImages.map((image) => {
                        return (
                            <Marker
                                mapRef={mapRef}
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

    if (!isMapScriptLoaded || isLoading || !mapStatus.center) {
        return <Spinner />;
    }

    if (isMapScriptLoadError) {
        showToast('지도를 불러오는데 실패했습니다');
        navigate(ROUTES.PATH.MAIN);
        return;
    }

    const isPinPointOnCharacter = (pinPoint: PinPoint) =>
        characterPosition?.latitude === pinPoint.latitude && characterPosition?.longitude === pinPoint.longitude;
    const isCharacterVisible = isCharacterMoving || mapStatus.zoom === ZOOM_SCALE.DEFAULT.ROUTE;
    const isIndividualImageMarkersVisible = mapStatus.zoom >= ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE;
    const isPhotoCardVisible = (photoCardIndex: number) =>
        !!(photoCardIndex === currentPinPointIndex && !isCharacterMoving);
    // TODO: 깜빡거림 현상 분석
    // const mapCenter = isCharacterVisible
    //     ? { latitude: characterPosition?.latitude || 0, longitude: characterPosition?.longitude || 0 }
    //     : mapStatus.center;

    return (
        <div css={container}>
            {/* {showSpinner && <Spinner text='장거리 이동 중...' />} */}
            <Header title={tripRouteInfo?.title || ''} isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />

            <Map
                zoom={mapStatus.zoom}
                // center={mapCenter} // TODO: 깜빡거림 현상 분석
                center={mapStatus.center}
                isInteractive={isMapInteractive}
                onLoad={handleMapRender}
                onZoomChanged={handleZoomChanged}
                onClick={handleMapClick}
            >
                <>
                    <Polyline pinPoints={pinPoints} isCharacterVisible={isCharacterVisible} />
                    {renderMarkers()}
                    <MapControlButtons
                        isVisible={!isCharacterMoving}
                        isCharacterView={isCharacterVisible}
                        isLastPinPoint={isLastPinPoint}
                        isCharacterPlaying={isPlayingAnimation}
                        handler={{
                            handleDateViewClick: navigateImagesByDatePage,
                            handleCharacterViewClick: showCharacterView,
                            handleCharacterPlayToggle: togglePlayingAnimation,
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

const travelMessageStyle = css`
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: ${COLORS.BACKGROUND.WHITE};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;

export default TripRoutePage;
