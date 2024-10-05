import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getTripMapData } from '@/api/trip';
import Loading from '@/components/common/Loading';
import Header from '@/components/layout/Header';
import { ENV } from '@/constants/auth';
import { PATH } from '@/constants/path';
import { PinPoint } from '@/types/trip';

const MOVE_DURATION = 3000;
const WAIT_DURATION = 2000;

const TimelineMap = () => {
    const [tripInfo, setTripInfo] = useState();
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
    const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [currentPinIndex, setCurrentPinIndex] = useState(0);
    const [showPhotoCard, setShowPhotoCard] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isAtPin, setIsAtPin] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mediaFiles, setMediaFiles] = useState();

    const mapRef = useRef<google.maps.Map | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const isMounted = useRef(true);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state;

    const handleWeatherClick = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/days-images', { state: { tripId: trip.tripId, mediaFiles } });
        }, 300);
    }, [navigate, trip.tripId, mediaFiles]);

    useEffect(() => {
        const fetchTripMapData = async () => {
            try {
                setIsLoading(true);
                const data = await getTripMapData(trip.tripId);
                setTripInfo(data.tripInfo);
                setMediaFiles(data.mediaFiles);
                if (data.pinPoints.length === 0) {
                    navigate(PATH.TRIP_LIST);
                    return;
                }
                const sortedDataByDate = data.pinPoints.sort(
                    (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
                );
                if (isMounted.current) {
                    setPinPoints(sortedDataByDate);
                    setCharacterPosition({ lat: sortedDataByDate[0].latitude, lng: sortedDataByDate[0].longitude });
                    setIsPlaying(false);
                    setIsAtPin(true);
                }
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchTripMapData();

        return () => {
            isMounted.current = false;
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, [trip.tripId, navigate]);

    const moveCharacter = useCallback(() => {
        if (currentPinIndex >= pinPoints.length - 1) {
            setIsPlaying(false);
            setIsMoving(false);
            return;
        }

        const start = pinPoints[currentPinIndex];
        const end = pinPoints[currentPinIndex + 1];
        setShowPhotoCard(false);
        setIsMoving(true);

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / MOVE_DURATION, 1);

            const newLat = start.latitude + (end.latitude - start.latitude) * progress;
            const newLng = start.longitude + (end.longitude - start.longitude) * progress;
            setCharacterPosition({ lat: newLat, lng: newLng });

            if (mapRef.current) {
                mapRef.current.panTo({ lat: newLat, lng: newLng });
            }

            if (progress < 1 && isPlaying) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                startTimeRef.current = null;
                setCurrentPinIndex((prev) => prev + 1);
                setShowPhotoCard(true);
                setIsMoving(false);
                setIsPlaying(false);
                setIsAtPin(true);

                // 2초 후 자동으로 다음 핀으로 이동
                autoPlayTimeoutRef.current = setTimeout(() => {
                    if (isMounted.current) {
                        setIsPlaying(true);
                    }
                }, WAIT_DURATION);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinIndex, pinPoints, isPlaying]);

    useEffect(() => {
        if (isPlaying && !isMoving) {
            moveCharacter();
        }
    }, [isPlaying, isMoving, moveCharacter]);

    useEffect(
        () => () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        },
        [],
    );

    const onMapLoad = React.useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const togglePlayPause = () => {
        if (currentPinIndex === pinPoints.length - 1) {
            // 마지막 핀포인트에서 재생 버튼을 누르면 첫 번째 핀포인트로 이동
            setCurrentPinIndex(0);
            setCharacterPosition({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
            if (mapRef.current) {
                mapRef.current.panTo({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
            }
            setShowPhotoCard(true);
            setIsPlaying(false);
            setIsMoving(false);
            setIsAtPin(true);
        } else if (isAtPin && !isPlaying) {
            // 핀포인트에 있고 재생 버튼을 누르면 바로 다음으로 이동
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
            if (isPlaying && autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        }
    };

    const characterIcon = useMemo(() => {
        if (mapsApiLoaded) {
            return {
                url: '/src/assets/images/dog.gif',
                scaledSize: new window.google.maps.Size(150, 150),
                anchor: new window.google.maps.Point(75, 90), // 이미지 하단 중앙에 앵커 설정
            };
        }
        return null;
    }, [mapsApiLoaded]);

    const svgMarker = useMemo(() => {
        if (mapsApiLoaded) {
            return {
                path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
                fillColor: '#17012E',
                fillOpacity: 0.8,
                strokeWeight: 1,
                rotation: 0,
                scale: 1.5,
                anchor: new window.google.maps.Point(12, 24), // SVG 마커의 하단 중앙에 앵커 설정
            };
        }
        return null;
    }, [mapsApiLoaded]);

    const mapOptions: google.maps.MapOptions = {
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
        rotateControl: false,
        clickableIcons: false,
        minZoom: 12,
    };

    return (
        <PageContainer isTransitioning={isTransitioning}>
            <Header title={`${trip.tripTitle}`} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
            <MapWrapper>
                {isLoading ? (
                    <LoadingWrapper>
                        <Loading />
                    </LoadingWrapper>
                ) : (
                    <LoadScript googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''} onLoad={() => setMapsApiLoaded(true)}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={characterPosition || undefined}
                            zoom={15}
                            options={mapOptions}
                            onLoad={onMapLoad}
                        >
                            {pinPoints.map((point, index) => (
                                <Marker
                                    key={point.pinPointId}
                                    position={{ lat: point.latitude, lng: point.longitude }}
                                    icon={svgMarker || undefined}
                                />
                            ))}
                            {characterPosition && (
                                <Marker position={characterPosition} icon={characterIcon || undefined} zIndex={1000} />
                            )}
                            {!isMoving && (
                                <ControlButton onClick={togglePlayPause}>
                                    {isPlaying || !isAtPin ? <Pause /> : <Play />}
                                </ControlButton>
                            )}
                            {showPhotoCard && currentPinIndex < pinPoints.length && (
                                <PhotoCardOverlay>
                                    <div
                                        css={photoCardStyle}
                                        onClick={() =>
                                            navigate(
                                                `/music-video/${trip.tripId}/${pinPoints[currentPinIndex].pinPointId}`,
                                                { state: trip.tripTitle },
                                            )
                                        }
                                    >
                                        <img
                                            css={imageStyle}
                                            src={pinPoints[currentPinIndex].mediaLink}
                                            alt='photo-card'
                                        />
                                    </div>
                                </PhotoCardOverlay>
                            )}
                            <WeatherSection onClick={handleWeatherClick}>
                                <div>날씨 정보 보기</div>
                                <ChevronUp size={20} />
                            </WeatherSection>
                        </GoogleMap>
                    </LoadScript>
                )}
            </MapWrapper>
        </PageContainer>
    );
};

const WeatherSection = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const MapWrapper = styled.div`
    flex-grow: 1;
    position: relative;
    z-index: 0;
    min-height: 400px;
`;

const ControlButton = styled.button`
    position: absolute;
    bottom: 64px;
    right: 10px;
    background-color: white;
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
    &:hover {
        background-color: #f0f0f0;
    }
`;

const PageContainer = styled.div<{ isTransitioning: boolean }>`
    height: 100vh;
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
    height: '100%',
    width: '100%',
};

const PhotoCardOverlay = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
`;

const photoCardStyle = css`
    background-color: white;
    border-radius: 8px;
    width: 150px;
    aspect-ratio: 1;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const imageStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
`;

export default TimelineMap;
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// import { css } from '@emotion/react';
// import styled from '@emotion/styled';
// import { GoogleMap, Marker, LoadScript, MarkerClusterer } from '@react-google-maps/api';
// import { Play, Pause, ChevronUp } from 'lucide-react';
// import { useLocation, useNavigate } from 'react-router-dom';

// import { getTripMapData } from '@/api/trip';
// import Loading from '@/components/common/Loading';
// import Header from '@/components/layout/Header';
// import { ENV } from '@/constants/auth';
// import { PATH } from '@/constants/path';

// const MOVE_DURATION = 3000;
// const WAIT_DURATION = 2000;
// const INITIAL_ZOOM = 13;
// const CLUSTERING_ZOOM_THRESHOLD = 14;
// interface TripInfo {
//     tripId: string;
//     tripTitle: string;
//     // Add other properties as needed
// }

// interface MediaFile {
//     latitude: number;
//     longitude: number;
//     mediaFileId: number;
//     mediaLink: string;
//     recordDate: string;
// }

// interface LocationState {
//     tripId: string;
//     tripTitle: string;
// }

// interface Clusterer {
//     addMarker(marker: google.maps.Marker, noClustererRedraw?: boolean): void;
//     // 필요한 경우 다른 메서드들도 추가할 수 있습니다.
// }

// const TimelineMap: React.FC = () => {
//     const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
//     const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [mapsApiLoaded, setMapsApiLoaded] = useState<boolean>(false);
//     const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
//     const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
//     const [showPhotoCard, setShowPhotoCard] = useState<boolean>(true);
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);
//     const [isMoving, setIsMoving] = useState<boolean>(false);
//     const [isAtPin, setIsAtPin] = useState<boolean>(true);
//     const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
//     const [currentZoom, setCurrentZoom] = useState<number>(INITIAL_ZOOM);
//     const [showClustering, setShowClustering] = useState<boolean>(false);

//     const mapRef = useRef<google.maps.Map | null>(null);
//     const animationRef = useRef<number | null>(null);
//     const startTimeRef = useRef<number | null>(null);
//     const isMounted = useRef<boolean>(true);
//     const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const trip = location.state as LocationState;

//     const handleWeatherClick = useCallback(() => {
//         setIsTransitioning(true);
//         setTimeout(() => {
//             navigate('/days-images', { state: { tripId: trip.tripId } });
//         }, 300);
//     }, [navigate, trip.tripId]);

//     useEffect(() => {
//         const fetchTripMapData = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await getTripMapData(trip.tripId);
//                 setTripInfo(data.tripInfo);
//                 if (data.mediaFiles.length === 0) {
//                     navigate(PATH.TRIP_LIST);
//                     return;
//                 }
//                 const sortedMediaFiles = data.mediaFiles.sort(
//                     (a: MediaFile, b: MediaFile) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
//                 );
//                 if (isMounted.current) {
//                     setMediaFiles(sortedMediaFiles);
//                     setCharacterPosition({ lat: sortedMediaFiles[0].latitude, lng: sortedMediaFiles[0].longitude });
//                     setIsPlaying(false);
//                     setIsAtPin(true);
//                 }
//             } catch (error) {
//                 console.error('Error fetching trip data:', error);
//             } finally {
//                 if (isMounted.current) {
//                     setIsLoading(false);
//                 }
//             }
//         };

//         fetchTripMapData();

//         return () => {
//             isMounted.current = false;
//             if (autoPlayTimeoutRef.current) {
//                 clearTimeout(autoPlayTimeoutRef.current);
//             }
//         };
//     }, [trip.tripId, navigate]);

//     const moveCharacter = useCallback(() => {
//         if (currentMediaIndex >= mediaFiles.length - 1 || showClustering) {
//             setIsPlaying(false);
//             setIsMoving(false);
//             return;
//         }

//         const start = mediaFiles[currentMediaIndex];
//         const end = mediaFiles[currentMediaIndex + 1];
//         setShowPhotoCard(false);
//         setIsMoving(true);

//         const animate = (time: number) => {
//             if (!startTimeRef.current) startTimeRef.current = time;
//             const progress = Math.min((time - startTimeRef.current) / MOVE_DURATION, 1);

//             const newLat = start.latitude + (end.latitude - start.latitude) * progress;
//             const newLng = start.longitude + (end.longitude - start.longitude) * progress;
//             setCharacterPosition({ lat: newLat, lng: newLng });

//             if (mapRef.current) {
//                 mapRef.current.panTo({ lat: newLat, lng: newLng });
//             }

//             if (progress < 1 && isPlaying && !showClustering) {
//                 animationRef.current = requestAnimationFrame(animate);
//             } else {
//                 startTimeRef.current = null;
//                 setCurrentMediaIndex((prev) => prev + 1);
//                 setShowPhotoCard(true);
//                 setIsMoving(false);
//                 setIsPlaying(false);
//                 setIsAtPin(true);

//                 if (!showClustering) {
//                     autoPlayTimeoutRef.current = setTimeout(() => {
//                         if (isMounted.current) {
//                             setIsPlaying(true);
//                         }
//                     }, WAIT_DURATION);
//                 }
//             }
//         };

//         animationRef.current = requestAnimationFrame(animate);
//     }, [currentMediaIndex, mediaFiles, isPlaying, showClustering]);

//     useEffect(() => {
//         if (isPlaying && !isMoving && !showClustering) {
//             moveCharacter();
//         }
//     }, [isPlaying, isMoving, moveCharacter, showClustering]);

//     useEffect(
//         () => () => {
//             if (animationRef.current) {
//                 cancelAnimationFrame(animationRef.current);
//             }
//             if (autoPlayTimeoutRef.current) {
//                 clearTimeout(autoPlayTimeoutRef.current);
//             }
//         },
//         [],
//     );

//     const onMapLoad = React.useCallback((map: google.maps.Map) => {
//         mapRef.current = map;
//     }, []);

//     const handleZoomChanged = () => {
//         if (mapRef.current) {
//             const newZoom = mapRef.current.getZoom();
//             if (newZoom) {
//                 setCurrentZoom(newZoom);
//                 setShowClustering(newZoom < CLUSTERING_ZOOM_THRESHOLD);
//                 if (newZoom < CLUSTERING_ZOOM_THRESHOLD) {
//                     setIsPlaying(false);
//                     setIsMoving(false);
//                     if (animationRef.current) {
//                         cancelAnimationFrame(animationRef.current);
//                     }
//                     if (autoPlayTimeoutRef.current) {
//                         clearTimeout(autoPlayTimeoutRef.current);
//                     }
//                 }
//             }
//         }
//     };

//     const togglePlayPause = () => {
//         if (showClustering) return;

//         if (currentMediaIndex === mediaFiles.length - 1) {
//             setCurrentMediaIndex(0);
//             setCharacterPosition({ lat: mediaFiles[0].latitude, lng: mediaFiles[0].longitude });
//             if (mapRef.current) {
//                 mapRef.current.panTo({ lat: mediaFiles[0].latitude, lng: mediaFiles[0].longitude });
//             }
//             setShowPhotoCard(true);
//             setIsPlaying(false);
//             setIsMoving(false);
//             setIsAtPin(true);
//         } else if (isAtPin && !isPlaying) {
//             setIsPlaying(true);
//         } else {
//             setIsPlaying(!isPlaying);
//             if (isPlaying && autoPlayTimeoutRef.current) {
//                 clearTimeout(autoPlayTimeoutRef.current);
//             }
//         }
//     };

//     const characterIcon = useMemo(() => {
//         if (mapsApiLoaded) {
//             return {
//                 url: '/src/assets/images/dog.gif',
//                 scaledSize: new window.google.maps.Size(150, 150),
//                 anchor: new window.google.maps.Point(75, 90),
//             };
//         }
//         return null;
//     }, [mapsApiLoaded]);

//     const mapOptions: google.maps.MapOptions = {
//         mapTypeControl: false,
//         fullscreenControl: false,
//         zoomControl: true,
//         streetViewControl: false,
//         rotateControl: false,
//         clickableIcons: false,
//     };

//     const renderClusterer = useCallback(() => {
//         if (!showClustering) return null;

//         return (
//             <MarkerClusterer>
//                 {(clusterer) => (
//                     <React.Fragment>
//                         {mediaFiles.map((mediaFile) => (
//                             <Marker
//                                 key={mediaFile.mediaFileId}
//                                 position={{ lat: mediaFile.latitude, lng: mediaFile.longitude }}
//                                 clusterer={clusterer}
//                             />
//                         ))}
//                     </React.Fragment>
//                 )}
//             </MarkerClusterer>
//         );
//     }, [mediaFiles, showClustering]);

//     return (
//         <PageContainer isTransitioning={isTransitioning}>
//             <Header title={`${trip.tripTitle}`} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
//             <MapWrapper>
//                 {isLoading ? (
//                     <LoadingWrapper>
//                         <Loading />
//                     </LoadingWrapper>
//                 ) : (
//                     <LoadScript googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''} onLoad={() => setMapsApiLoaded(true)}>
//                         <GoogleMap
//                             mapContainerStyle={mapContainerStyle}
//                             center={characterPosition || undefined}
//                             zoom={INITIAL_ZOOM}
//                             options={mapOptions}
//                             onLoad={onMapLoad}
//                             onZoomChanged={handleZoomChanged}
//                         >
//                             {renderClusterer()}
//                             {!showClustering && characterPosition && (
//                                 <Marker position={characterPosition} icon={characterIcon || undefined} zIndex={1000} />
//                             )}
//                             {!showClustering && !isMoving && (
//                                 <ControlButton onClick={togglePlayPause}>
//                                     {isPlaying || !isAtPin ? <Pause /> : <Play />}
//                                 </ControlButton>
//                             )}
//                             {!showClustering && showPhotoCard && currentMediaIndex < mediaFiles.length && (
//                                 <PhotoCardOverlay>
//                                     <div
//                                         css={photoCardStyle}
//                                         onClick={() =>
//                                             navigate(
//                                                 `/music-video/${trip.tripId}/${mediaFiles[currentMediaIndex].mediaFileId}`,
//                                                 { state: trip.tripTitle },
//                                             )
//                                         }
//                                     >
//                                         <img
//                                             css={imageStyle}
//                                             src={mediaFiles[currentMediaIndex].mediaLink}
//                                             alt='photo-card'
//                                         />
//                                     </div>
//                                 </PhotoCardOverlay>
//                             )}
//                             <WeatherSection onClick={handleWeatherClick}>
//                                 <div>날씨 정보 보기</div>
//                                 <ChevronUp size={20} />
//                             </WeatherSection>
//                         </GoogleMap>
//                     </LoadScript>
//                 )}
//             </MapWrapper>
//         </PageContainer>
//     );
// };

// const WeatherSection = styled.div`
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background-color: white;
//     height: 54px;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 0 20px;
//     font-size: 16px;
//     color: #333;
//     cursor: pointer;
//     box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
//     z-index: 1000;
// `;

// const MapWrapper = styled.div`
//     flex-grow: 1;
//     position: relative;
//     z-index: 0;
//     min-height: 400px;
// `;

// const ControlButton = styled.button`
//     position: absolute;
//     bottom: 64px;
//     right: 10px;
//     background-color: white;
//     border: none;
//     border-radius: 50%;
//     width: 40px;
//     height: 40px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     cursor: pointer;
//     box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
//     z-index: 1000;
//     &:hover {
//         background-color: #f0f0f0;
//     }
// `;

// const PageContainer = styled.div<{ isTransitioning: boolean }>`
//     height: 100vh;
//     display: flex;
//     flex-direction: column;
//     transition: transform 0.3s ease-in-out;
//     transform: ${(props) => (props.isTransitioning ? 'translateY(-100%)' : 'translateY(0)')};
// `;

// const LoadingWrapper = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: calc(100vh - 54px);
// `;

// const mapContainerStyle = {
//     height: '100%',
//     width: '100%',
// };

// const PhotoCardOverlay = styled.div`
//     position: absolute;
//     top: 10px;
//     right: 10px;
//     z-index: 1000;
// `;

// const photoCardStyle = css`
//     background-color: white;
//     border-radius: 8px;
//     width: 150px;
//     aspect-ratio: 1;
//     padding: 4px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     box-shadow:
//         rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
//         rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
//     cursor: pointer;
//     transition: transform 0.2s ease;

//     &:hover {
//         transform: scale(1.05);
//     }
// `;

// const imageStyle = css`
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     border-radius: 4px;
// `;

// export default TimelineMap;
