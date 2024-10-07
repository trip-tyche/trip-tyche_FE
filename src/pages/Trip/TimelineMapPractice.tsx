// // import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// // import { css } from '@emotion/react';
// // import styled from '@emotion/styled';
// // import { GoogleMap, Marker, LoadScript, useLoadScript } from '@react-google-maps/api';
// // import { Play, Pause, ChevronUp } from 'lucide-react';
// // import { useLocation, useNavigate } from 'react-router-dom';

// // import { getTripMapData } from '@/api/trip';
// // import Loading from '@/components/common/Loading';
// // import Header from '@/components/layout/Header';
// // import { ENV } from '@/constants/auth';
// // import { PATH } from '@/constants/path';
// // import theme from '@/styles/theme';
// // import { PinPoint, TripInfo } from '@/types/trip';
// // import { formatDateToKorean, getDayNumber } from '@/utils/date';

// // const MOVE_DURATION = 3000;
// // const WAIT_DURATION = 2000;

// // interface TripInfo {
// //     country: string;
// //     endDate: string;
// //     hashtags: null;
// //     startDate: string;
// //     tripId: string;
// //     tripTitle: string;
// // }

// // const TimelineMap = () => {
// //     const [tripInfo, setTripInfo] = useState<TripInfo>();
// //     const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
// //     const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
// //     const [currentPinIndex, setCurrentPinIndex] = useState(0);
// //     const [showPhotoCard, setShowPhotoCard] = useState(true);
// //     const [isPlaying, setIsPlaying] = useState(false);
// //     const [isMoving, setIsMoving] = useState(false);
// //     const [isAtPin, setIsAtPin] = useState(true);
// //     const [isTransitioning, setIsTransitioning] = useState(false);
// //     const [mediaFiles, setMediaFiles] = useState();
// //     const [currentDate, setCurrentDate] = useState<string>();
// //     const [currentDay, setCurrentDay] = useState<string>();

// //     const mapRef = useRef<google.maps.Map | null>(null);
// //     const animationRef = useRef<number | null>(null);
// //     const startTimeRef = useRef<number | null>(null);
// //     const isMounted = useRef(true);
// //     const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     useEffect(() => {
// //         if (!localStorage.getItem('tripId') || localStorage.getItem('tripId') === 'undefined') {
// //             localStorage.setItem('tripId', location.state.tripId);
// //         }

// //         if (!localStorage.getItem('tripTitle') || localStorage.getItem('tripTitle') === 'undefined') {
// //             localStorage.setItem('tripTitle', location.state.tripTitle);
// //         }
// //     }, []);

// //     const tripId = localStorage.getItem('tripId');
// //     const tripTitle = localStorage.getItem('tripTitle');

// //     const handleDayClick = useCallback(() => {
// //         setIsTransitioning(true);
// //         setTimeout(() => {
// //             navigate('/days-images', { state: { tripId, currentDate } });
// //         }, 300);
// //     }, [navigate, tripId, currentDate]);

// //     useEffect(() => {
// //         const fetchTripMapData = async () => {
// //             try {
// //                 if (!tripId) {
// //                     return;
// //                 }
// //                 setIsLoading(true);
// //                 console.log('************************************************');
// //                 const data = await getTripMapData(tripId);
// //                 setTripInfo(data.tripInfo);
// //                 setMediaFiles(data.mediaFiles);
// //                 if (data.pinPoints.length === 0) {
// //                     navigate(PATH.TRIP_LIST);
// //                     return;
// //                 }
// //                 const sortedDataByDate = data.pinPoints.sort(
// //                     (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
// //                 );
// //                 if (isMounted.current) {
// //                     setPinPoints(sortedDataByDate);
// //                     setCharacterPosition({ lat: sortedDataByDate[0].latitude, lng: sortedDataByDate[0].longitude });
// //                     setIsPlaying(false);
// //                     setIsAtPin(true);
// //                 }
// //             } catch (error) {
// //                 console.error('Error fetching trip data:', error);
// //             } finally {
// //                 if (isMounted.current) {
// //                     setIsLoading(false);
// //                 }
// //             }
// //         };

// //         fetchTripMapData();

// //         return () => {
// //             isMounted.current = false;
// //             if (autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //         };
// //     }, [tripId, navigate]);

// //     const moveCharacter = useCallback(() => {
// //         if (currentPinIndex >= pinPoints.length - 1) {
// //             setIsPlaying(false);
// //             setIsMoving(false);
// //             return;
// //         }

// //         const start = pinPoints[currentPinIndex];
// //         const end = pinPoints[currentPinIndex + 1];
// //         setShowPhotoCard(false);
// //         setIsMoving(true);

// //         const animate = (time: number) => {
// //             if (!startTimeRef.current) startTimeRef.current = time;
// //             const progress = Math.min((time - startTimeRef.current) / MOVE_DURATION, 1);

// //             const newLat = start.latitude + (end.latitude - start.latitude) * progress;
// //             const newLng = start.longitude + (end.longitude - start.longitude) * progress;
// //             setCharacterPosition({ lat: newLat, lng: newLng });

// //             if (mapRef.current) {
// //                 mapRef.current.panTo({ lat: newLat, lng: newLng });
// //             }

// //             if (progress < 1 && isPlaying) {
// //                 animationRef.current = requestAnimationFrame(animate);
// //             } else {
// //                 startTimeRef.current = null;
// //                 setCurrentPinIndex((prev) => prev + 1);
// //                 setShowPhotoCard(true);
// //                 setIsMoving(false);
// //                 setIsPlaying(false);
// //                 setIsAtPin(true);

// //                 // 2초 후 자동으로 다음 핀으로 이동
// //                 autoPlayTimeoutRef.current = setTimeout(() => {
// //                     if (isMounted.current) {
// //                         setIsPlaying(true);
// //                     }
// //                 }, WAIT_DURATION);
// //             }
// //         };

// //         animationRef.current = requestAnimationFrame(animate);
// //     }, [currentPinIndex, pinPoints, isPlaying]);

// //     useEffect(() => {
// //         if (isPlaying && !isMoving) {
// //             moveCharacter();
// //         }

// //         if (!(pinPoints.length !== 0 && tripInfo)) {
// //             return;
// //         }
// //         setCurrentDate(pinPoints[currentPinIndex].recordDate);
// //         setCurrentDay(getDayNumber(currentDate as string, tripInfo.startDate));
// //     }, [isPlaying, isMoving, moveCharacter, pinPoints, currentPinIndex, tripInfo, currentDate]);

// //     useEffect(
// //         () => () => {
// //             if (animationRef.current) {
// //                 cancelAnimationFrame(animationRef.current);
// //             }
// //             if (autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //         },
// //         [],
// //     );

// //     const onMapLoad = React.useCallback((map: google.maps.Map) => {
// //         mapRef.current = map;
// //     }, []);

// //     const togglePlayPause = () => {
// //         if (currentPinIndex === pinPoints.length - 1) {
// //             // 마지막 핀포인트에서 재생 버튼을 누르면 첫 번째 핀포인트로 이동
// //             setCurrentPinIndex(0);
// //             setCharacterPosition({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
// //             if (mapRef.current) {
// //                 mapRef.current.panTo({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
// //             }
// //             setShowPhotoCard(true);
// //             setIsPlaying(false);
// //             setIsMoving(false);
// //             setIsAtPin(true);
// //         } else if (isAtPin && !isPlaying) {
// //             // 핀포인트에 있고 재생 버튼을 누르면 바로 다음으로 이동
// //             setIsPlaying(true);
// //         } else {
// //             setIsPlaying(!isPlaying);
// //             if (isPlaying && autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //         }
// //     };

// //     const characterIcon = useMemo(() => {
// //         if (mapsApiLoaded) {
// //             return {
// //                 url: '/src/assets/images/dog.gif',
// //                 scaledSize: new window.google.maps.Size(150, 150),
// //                 anchor: new window.google.maps.Point(75, 90), // 이미지 하단 중앙에 앵커 설정
// //             };
// //         }
// //         return null;
// //     }, [mapsApiLoaded]);

// //     const svgMarker = useMemo(() => {
// //         if (mapsApiLoaded) {
// //             return {
// //                 path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
// //                 fillColor: '#17012E',
// //                 fillOpacity: 0.8,
// //                 strokeWeight: 1,
// //                 rotation: 0,
// //                 scale: 1.5,
// //                 anchor: new window.google.maps.Point(12, 24), // SVG 마커의 하단 중앙에 앵커 설정
// //             };
// //         }
// //         return null;
// //     }, [mapsApiLoaded]);

// //     const mapOptions: google.maps.MapOptions = {
// //         mapTypeControl: false,
// //         fullscreenControl: false,
// //         zoomControl: false,
// //         streetViewControl: false,
// //         rotateControl: false,
// //         clickableIcons: false,
// //         minZoom: 12,
// //     };

// //     return (
// //         <PageContainer isTransitioning={isTransitioning}>
// //             <Header title={`${tripTitle}`} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
// //             <MapWrapper>
// //                 {isLoading ? (
// //                     <LoadingWrapper>
// //                         <Loading />
// //                     </LoadingWrapper>
// //                 ) : (
// //                     <LoadScript googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''} onLoad={() => setMapsApiLoaded(true)}>
// //                         <GoogleMap
// //                             mapContainerStyle={mapContainerStyle}
// //                             center={characterPosition || undefined}
// //                             zoom={15}
// //                             options={mapOptions}
// //                             onLoad={onMapLoad}
// //                         >
// //                             {pinPoints.map((point, index) => (
// //                                 <Marker
// //                                     key={point.pinPointId}
// //                                     position={{ lat: point.latitude, lng: point.longitude }}
// //                                     icon={svgMarker || undefined}
// //                                 />
// //                             ))}
// //                             {characterPosition && (
// //                                 <Marker position={characterPosition} icon={characterIcon || undefined} zIndex={1000} />
// //                             )}
// //                             {!isMoving && (
// //                                 <ControlButton onClick={togglePlayPause}>
// //                                     {isPlaying || !isAtPin ? <Pause /> : <Play />}
// //                                 </ControlButton>
// //                             )}
// //                             {showPhotoCard && currentPinIndex < pinPoints.length && (
// //                                 <PhotoCardOverlay>
// //                                     <div
// //                                         css={photoCardStyle}
// //                                         onClick={() =>
// //                                             navigate(`/music-video/${tripId}/${pinPoints[currentPinIndex].pinPointId}`)
// //                                         }
// //                                     >
// //                                         <img
// //                                             css={imageStyle}
// //                                             src={pinPoints[currentPinIndex].mediaLink}
// //                                             alt='photo-card'
// //                                         />
// //                                     </div>
// //                                 </PhotoCardOverlay>
// //                             )}
// //                             <DaySection onClick={handleDayClick}>
// //                                 <div css={dayInfoTextStyle}>
// //                                     <h2>{currentDay}</h2>
// //                                     <p>{currentDate && formatDateToKorean(currentDate)}</p>
// //                                 </div>
// //                                 <ChevronUp size={20} />
// //                             </DaySection>
// //                         </GoogleMap>
// //                     </LoadScript>
// //                 )}
// //             </MapWrapper>
// //         </PageContainer>
// //     );
// // };

// // const DaySection = styled.div`
// //     position: absolute;
// //     bottom: 0;
// //     left: 0;
// //     right: 0;
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     padding: 0 20px;
// //     cursor: pointer;
// //     box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
// //     z-index: 1000;
// //     height: ${theme.heights.xtall_60};
// //     background-color: ${theme.colors.white};
// // `;

// // const dayInfoTextStyle = css`
// //     display: flex;
// //     flex-direction: column;
// //     gap: 8px;

// //     h2 {
// //         font-size: 20px;
// //         font-weight: 600;
// //         margin: 0;
// //     }

// //     p {
// //         font-size: 14px;
// //         color: ${theme.colors.darkGray};
// //         margin: 0;
// //     }
// // `;

// // const MapWrapper = styled.div`
// //     flex-grow: 1;
// //     position: relative;
// //     z-index: 0;
// //     min-height: 400px;
// // `;

// // const ControlButton = styled.button`
// //     position: absolute;
// //     bottom: 64px;
// //     right: 10px;
// //     background-color: white;
// //     border: none;
// //     border-radius: 50%;
// //     width: 40px;
// //     height: 40px;
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //     cursor: pointer;
// //     box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
// //     z-index: 1000;
// //     &:hover {
// //         background-color: #f0f0f0;
// //     }
// // `;

// // const PageContainer = styled.div<{ isTransitioning: boolean }>`
// //     height: 100vh;
// //     display: flex;
// //     flex-direction: column;
// //     transition: transform 0.3s ease-in-out;
// //     transform: ${(props) => (props.isTransitioning ? 'translateY(-100%)' : 'translateY(0)')};
// // `;

// // const LoadingWrapper = styled.div`
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //     height: calc(100vh - 54px);
// // `;

// // const mapContainerStyle = {
// //     height: '100%',
// //     width: '100%',
// // };

// // const PhotoCardOverlay = styled.div`
// //     position: absolute;
// //     top: 10px;
// //     right: 10px;
// //     z-index: 1000;
// // `;

// // const photoCardStyle = css`
// //     background-color: white;
// //     border-radius: 8px;
// //     width: 150px;
// //     aspect-ratio: 1;
// //     padding: 4px;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     box-shadow:
// //         rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
// //         rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
// //     cursor: pointer;
// //     transition: transform 0.2s ease;

// //     &:hover {
// //         transform: scale(1.05);
// //     }
// // `;

// // const imageStyle = css`
// //     width: 100%;
// //     height: 100%;
// //     object-fit: cover;
// //     border-radius: 4px;
// // `;

// // export default TimelineMap;

// ////////////////////////////////////////////////////////////////////
// // 동적 클러스터링
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
//             navigate('/days-images', { state: { tripId: tripId } });
//         }, 300);
//     }, [navigate, tripId]);

//     useEffect(() => {
//         const fetchTripMapData = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await getTripMapData(tripId);
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
//     }, [tripId, navigate]);

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
//                                                 `/music-video/${tripId}/${mediaFiles[currentMediaIndex].mediaFileId}`,
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

// // const WeatherSection = styled.div`
// //     position: absolute;
// //     bottom: 0;
// //     left: 0;
// //     right: 0;
// //     background-color: white;
// //     height: 54px;
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     padding: 0 20px;
// //     font-size: 16px;
// //     color: #333;
// //     cursor: pointer;
// //     box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
// //     z-index: 1000;
// // `;

// // const MapWrapper = styled.div`
// //     flex-grow: 1;
// //     position: relative;
// //     z-index: 0;
// //     min-height: 400px;
// // `;

// // const ControlButton = styled.button`
// //     position: absolute;
// //     bottom: 64px;
// //     right: 10px;
// //     background-color: white;
// //     border: none;
// //     border-radius: 50%;
// //     width: 40px;
// //     height: 40px;
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //     cursor: pointer;
// //     box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
// //     z-index: 1000;
// //     &:hover {
// //         background-color: #f0f0f0;
// //     }
// // `;

// // const PageContainer = styled.div<{ isTransitioning: boolean }>`
// //     height: 100vh;
// //     display: flex;
// //     flex-direction: column;
// //     transition: transform 0.3s ease-in-out;
// //     transform: ${(props) => (props.isTransitioning ? 'translateY(-100%)' : 'translateY(0)')};
// // `;

// // const LoadingWrapper = styled.div`
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //     height: calc(100vh - 54px);
// // `;

// // const mapContainerStyle = {
// //     height: '100%',
// //     width: '100%',
// // };

// // const PhotoCardOverlay = styled.div`
// //     position: absolute;
// //     top: 10px;
// //     right: 10px;
// //     z-index: 1000;
// // `;

// // const photoCardStyle = css`
// //     background-color: white;
// //     border-radius: 8px;
// //     width: 150px;
// //     aspect-ratio: 1;
// //     padding: 4px;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     box-shadow:
// //         rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
// //         rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
// //     cursor: pointer;
// //     transition: transform 0.2s ease;

// //     &:hover {
// //         transform: scale(1.05);
// //     }
// // `;

// // const imageStyle = css`
// //     width: 100%;
// //     height: 100%;
// //     object-fit: cover;
// //     border-radius: 4px;
// // `;

// // export default TimelineMap;

// ////////////////////////////////////////////////////////////////////
// // 페이지 진입시 로드뜨는 에러 해결된 코드, 아직 일시정지 버튼 오류는 해결하지 못한 코드
// // const TimelineMap: React.FC = () => {
// //     const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
// //     const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
// //     const [currentPinIndex, setCurrentPinIndex] = useState(0);
// //     const [showPhotoCard, setShowPhotoCard] = useState(true);
// //     const [isPlaying, setIsPlaying] = useState(false);
// //     const [isMoving, setIsMoving] = useState(false);
// //     const [isAtPin, setIsAtPin] = useState(true);
// //     const [isTransitioning, setIsTransitioning] = useState(false);
// //     const [currentDate, setCurrentDate] = useState<string | undefined>();
// //     const [currentDay, setCurrentDay] = useState<string | undefined>();

// //     const mapRef = useRef<google.maps.Map | null>(null);
// //     const animationRef = useRef<number | null>(null);
// //     const startTimeRef = useRef<number | null>(null);
// //     const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     const tripId = localStorage.getItem('tripId');
// //     const tripTitle = localStorage.getItem('tripTitle');

// //     useEffect(() => {
// //         if (!tripId || tripId === 'undefined') {
// //             const newTripId = location.state?.tripId;
// //             if (newTripId) {
// //                 localStorage.setItem('tripId', newTripId);
// //             } else {
// //                 navigate(PATH.TRIP_LIST);
// //                 return;
// //             }
// //         }

// //         if (!tripTitle || tripTitle === 'undefined') {
// //             const newTripTitle = location.state?.tripTitle;
// //             if (newTripTitle) {
// //                 localStorage.setItem('tripTitle', newTripTitle);
// //             }
// //         }
// //     }, [location.state, navigate]);

// //     const fetchTripMapData = useCallback(async () => {
// //         if (!tripId) return;

// //         try {
// //             setIsLoading(true);
// //             const data = await getTripMapData(tripId);
// //             setTripInfo(data.tripInfo);

// //             if (data.pinPoints.length === 0) {
// //                 navigate(PATH.TRIP_LIST);
// //                 return;
// //             }

// //             const sortedDataByDate = data.pinPoints.sort(
// //                 (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
// //             );

// //             setPinPoints(sortedDataByDate);
// //             setCharacterPosition({ lat: sortedDataByDate[0].latitude, lng: sortedDataByDate[0].longitude });
// //             setIsPlaying(false);
// //             setIsAtPin(true);
// //         } catch (error) {
// //             console.error('Error fetching trip data:', error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     }, [tripId, navigate]);

// //     useEffect(() => {
// //         fetchTripMapData();

// //         return () => {
// //             if (autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //             if (animationRef.current) {
// //                 cancelAnimationFrame(animationRef.current);
// //             }
// //         };
// //     }, [fetchTripMapData]);

// //     const moveCharacter = useCallback(() => {
// //         if (currentPinIndex >= pinPoints.length - 1) {
// //             setIsPlaying(false);
// //             setIsMoving(false);
// //             return;
// //         }

// //         const start = pinPoints[currentPinIndex];
// //         const end = pinPoints[currentPinIndex + 1];
// //         setShowPhotoCard(false);
// //         setIsMoving(true);

// //         const animate = (time: number) => {
// //             if (!startTimeRef.current) startTimeRef.current = time;
// //             const progress = Math.min((time - startTimeRef.current) / MOVE_DURATION, 1);

// //             const newLat = start.latitude + (end.latitude - start.latitude) * progress;
// //             const newLng = start.longitude + (end.longitude - start.longitude) * progress;
// //             setCharacterPosition({ lat: newLat, lng: newLng });

// //             if (mapRef.current) {
// //                 mapRef.current.panTo({ lat: newLat, lng: newLng });
// //             }

// //             if (progress < 1 && isPlaying) {
// //                 animationRef.current = requestAnimationFrame(animate);
// //             } else {
// //                 startTimeRef.current = null;
// //                 setCurrentPinIndex((prev) => prev + 1);
// //                 setShowPhotoCard(true);
// //                 setIsMoving(false);
// //                 setIsPlaying(false);
// //                 setIsAtPin(true);

// //                 autoPlayTimeoutRef.current = setTimeout(() => {
// //                     setIsPlaying(true);
// //                 }, WAIT_DURATION);
// //             }
// //         };

// //         animationRef.current = requestAnimationFrame(animate);
// //     }, [currentPinIndex, pinPoints, isPlaying]);

// //     useEffect(() => {
// //         if (isPlaying && !isMoving) {
// //             moveCharacter();
// //         }

// //         if (pinPoints.length !== 0 && tripInfo) {
// //             setCurrentDate(pinPoints[currentPinIndex].recordDate);
// //             setCurrentDay(getDayNumber(pinPoints[currentPinIndex].recordDate, tripInfo.startDate));
// //         }
// //     }, [isPlaying, isMoving, moveCharacter, pinPoints, currentPinIndex, tripInfo]);

// //     const handleDayClick = useCallback(() => {
// //         setIsTransitioning(true);
// //         setTimeout(() => {
// //             navigate('/days-images', { state: { tripId, currentDate } });
// //         }, 300);
// //     }, [navigate, tripId, currentDate]);

// //     const togglePlayPause = useCallback(() => {
// //         if (currentPinIndex === pinPoints.length - 1) {
// //             setCurrentPinIndex(0);
// //             setCharacterPosition({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
// //             if (mapRef.current) {
// //                 mapRef.current.panTo({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
// //             }
// //             setShowPhotoCard(true);
// //             setIsPlaying(false);
// //             setIsMoving(false);
// //             setIsAtPin(true);
// //         } else if (isAtPin && !isPlaying) {
// //             setIsPlaying(true);
// //         } else {
// //             setIsPlaying(!isPlaying);
// //             if (isPlaying && autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //         }
// //     }, [currentPinIndex, pinPoints, isAtPin, isPlaying]);

// //     const { isLoaded, loadError } = useLoadScript({
// //         googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
// //     });

// //     const characterIcon = useMemo(() => {
// //         if (isLoaded) {
// //             return {
// //                 url: '/src/assets/images/dog.gif',
// //                 scaledSize: new window.google.maps.Size(150, 150),
// //                 anchor: new window.google.maps.Point(75, 100),
// //             };
// //         }
// //         return null;
// //     }, [isLoaded]);

// //     const svgMarker = useMemo(() => {
// //         if (isLoaded) {
// //             return {
// //                 path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
// //                 fillColor: '#17012E',
// //                 fillOpacity: 0.8,
// //                 strokeWeight: 1,
// //                 rotation: 0,
// //                 scale: 1.5,
// //                 anchor: new window.google.maps.Point(12, 24),
// //             };
// //         }
// //         return null;
// //     }, [isLoaded]);

// //     const mapOptions: google.maps.MapOptions = {
// //         mapTypeControl: false,
// //         fullscreenControl: false,
// //         zoomControl: false,
// //         streetViewControl: false,
// //         rotateControl: false,
// //         clickableIcons: false,
// //         minZoom: 12,
// //     };

// //     if (loadError) {
// //         return <div>Error loading maps</div>;
// //     }

// //     if (!isLoaded) {
// //         return <div>Loading maps</div>;
// //     }

// //     return (
// //         <PageContainer isTransitioning={isTransitioning}>
// //             <Header title={tripTitle || ''} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
// //             <MapWrapper>
// //                 {isLoading ? (
// //                     <LoadingWrapper>
// //                         <Loading />
// //                     </LoadingWrapper>
// //                 ) : (
// //                     <GoogleMap
// //                         mapContainerStyle={mapContainerStyle}
// //                         center={characterPosition || undefined}
// //                         zoom={15}
// //                         options={mapOptions}
// //                         onLoad={(map) => {
// //                             mapRef.current = map;
// //                         }}
// //                     >
// //                         {pinPoints.map((point) => (
// //                             <Marker
// //                                 key={point.pinPointId}
// //                                 position={{ lat: point.latitude, lng: point.longitude }}
// //                                 icon={svgMarker || undefined}
// //                             />
// //                         ))}
// //                         {characterPosition && (
// //                             <Marker position={characterPosition} icon={characterIcon || undefined} zIndex={1000} />
// //                         )}
// //                         {!isMoving && (
// //                             <ControlButton onClick={togglePlayPause}>
// //                                 {isPlaying || !isAtPin ? <Pause /> : <Play />}
// //                             </ControlButton>
// //                         )}
// //                         {showPhotoCard && currentPinIndex < pinPoints.length && (
// //                             <PhotoCardOverlay>
// //                                 <div
// //                                     css={photoCardStyle}
// //                                     onClick={() =>
// //                                         navigate(`/music-video/${tripId}/${pinPoints[currentPinIndex].pinPointId}`)
// //                                     }
// //                                 >
// //                                     <img css={imageStyle} src={pinPoints[currentPinIndex].mediaLink} alt='photo-card' />
// //                                 </div>
// //                             </PhotoCardOverlay>
// //                         )}
// //                         <DaySection onClick={handleDayClick}>
// //                             <div css={dayInfoTextStyle}>
// //                                 <h2>{currentDay}</h2>
// //                                 <p>{currentDate && formatDateToKorean(currentDate)}</p>
// //                             </div>
// //                             <ChevronUp size={20} />
// //                         </DaySection>
// //                     </GoogleMap>
// //                 )}
// //             </MapWrapper>
// //         </PageContainer>
// //     );
// // };
// // /////////////////////////////////////////////////////////////////////
// // 동적 클러스터링 제외한 모든 기능
// // import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// // import { css } from '@emotion/react';
// // import styled from '@emotion/styled';
// // import { GoogleMap, Marker, useLoadScript, OverlayView, MarkerClusterer } from '@react-google-maps/api';
// // import { Play, Pause, ChevronUp } from 'lucide-react';
// // import { useNavigate, useParams } from 'react-router-dom';

// // import { getTripMapData } from '@/api/trip';
// // import Loading from '@/components/common/Loading';
// // import Header from '@/components/layout/Header';
// // import { ENV } from '@/constants/auth';
// // import { PATH } from '@/constants/path';
// // import theme from '@/styles/theme';
// // import { PinPoint, TripInfo } from '@/types/trip';
// // import { formatDateToKorean, getDayNumber } from '@/utils/date';

// // const MOVE_DURATION = 3000;
// // const WAIT_DURATION = 3000;

// // const PHOTO_CARD_WIDTH = 150;
// // const PHOTO_CARD_HEIGHT = 150;

// // const INITIAL_ZOOM_LEVEL = 14;
// // const CLUSTERING_ZOOM_THRESHOLD = 14;

// // const TimelineMap: React.FC = () => {
// //     const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
// //     const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
// //     const [currentPinIndex, setCurrentPinIndex] = useState(0);
// //     const [showPhotoCard, setShowPhotoCard] = useState(true);
// //     const [isPlaying, setIsPlaying] = useState(false);
// //     const [isMoving, setIsMoving] = useState(false);
// //     const [isAtPin, setIsAtPin] = useState(true);
// //     const [isTransitioning, setIsTransitioning] = useState(false);
// //     const [currentDate, setCurrentDate] = useState<string | undefined>();
// //     const [currentDay, setCurrentDay] = useState<string | undefined>();
// //     const [photoCardPosition, setPhotoCardPosition] = useState<google.maps.LatLngLiteral | null>(null);

// //     const mapRef = useRef<google.maps.Map | null>(null);
// //     const animationRef = useRef<number | null>(null);
// //     const startTimeRef = useRef<number | null>(null);
// //     const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //     const navigate = useNavigate();
// //     const { tripId } = useParams();

// //     const fetchTripMapData = useCallback(async () => {
// //         if (!tripId) return;

// //         try {
// //             setIsLoading(true);
// //             const data = await getTripMapData(tripId);
// //             console.log(data);
// //             setTripInfo(data.tripInfo);

// //             if (data.pinPoints.length === 0) {
// //                 navigate(PATH.TRIP_LIST);
// //                 return;
// //             }

// //             const sortedDataByDate = data.pinPoints.sort(
// //                 (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
// //             );

// //             setPinPoints(sortedDataByDate);
// //             setCharacterPosition({ lat: sortedDataByDate[0].latitude, lng: sortedDataByDate[0].longitude });
// //             setIsPlaying(false);
// //             setIsAtPin(true);
// //         } catch (error) {
// //             console.error('Error fetching trip data:', error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     }, [tripId, navigate]);

// //     useEffect(() => {
// //         fetchTripMapData();

// //         return () => {
// //             if (autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //             if (animationRef.current) {
// //                 cancelAnimationFrame(animationRef.current);
// //             }
// //         };
// //     }, [fetchTripMapData]);

// //     const moveCharacter = useCallback(() => {
// //         if (currentPinIndex >= pinPoints.length - 1) {
// //             setIsPlaying(false);
// //             setIsMoving(false);
// //             setIsAtPin(true);
// //             return;
// //         }

// //         const start = pinPoints[currentPinIndex];
// //         const end = pinPoints[currentPinIndex + 1];
// //         setShowPhotoCard(false);
// //         setIsMoving(true);
// //         setIsAtPin(false);

// //         const animate = (time: number) => {
// //             if (!startTimeRef.current) startTimeRef.current = time;
// //             const progress = Math.min((time - startTimeRef.current) / MOVE_DURATION, 1);

// //             const newLat = start.latitude + (end.latitude - start.latitude) * progress;
// //             const newLng = start.longitude + (end.longitude - start.longitude) * progress;
// //             const newPosition = { lat: newLat, lng: newLng };
// //             setCharacterPosition(newPosition);
// //             setPhotoCardPosition(newPosition); // 즉시 photoCardPosition 업데이트

// //             if (mapRef.current) {
// //                 mapRef.current.panTo(newPosition);
// //             }

// //             if (progress < 1) {
// //                 animationRef.current = requestAnimationFrame(animate);
// //             } else {
// //                 startTimeRef.current = null;
// //                 setCurrentPinIndex((prev) => prev + 1);
// //                 setShowPhotoCard(true);
// //                 setIsMoving(false);
// //                 setIsAtPin(true);

// //                 // 항상 WAIT_DURATION 동안 대기
// //                 autoPlayTimeoutRef.current = setTimeout(() => {
// //                     if (isPlaying) {
// //                         moveCharacter();
// //                     }
// //                 }, WAIT_DURATION);
// //             }
// //         };

// //         animationRef.current = requestAnimationFrame(animate);
// //     }, [currentPinIndex, pinPoints, isPlaying]);

// //     useEffect(() => {
// //         if (isPlaying && !isMoving && isAtPin) {
// //             autoPlayTimeoutRef.current = setTimeout(() => {
// //                 moveCharacter();
// //             }, WAIT_DURATION);
// //         }

// //         return () => {
// //             if (autoPlayTimeoutRef.current) {
// //                 clearTimeout(autoPlayTimeoutRef.current);
// //             }
// //         };
// //     }, [isPlaying, isMoving, isAtPin, moveCharacter]);

// //     useEffect(() => {
// //         if (pinPoints.length > 0 && tripInfo) {
// //             const currentPinPoint = pinPoints[currentPinIndex];
// //             setCurrentDate(currentPinPoint.recordDate);
// //             setCurrentDay(getDayNumber(currentPinPoint.recordDate, tripInfo.startDate));
// //         }
// //     }, [currentPinIndex, pinPoints, tripInfo]);

// //     useEffect(() => {
// //         if (characterPosition) {
// //             setPhotoCardPosition(characterPosition);
// //         }
// //     }, [characterPosition]);

// //     const handleDayClick = useCallback(() => {
// //         setIsTransitioning(true);
// //         setTimeout(() => {
// //             navigate('/days-images');
// //         }, 300);
// //         if (currentDate) {
// //             localStorage.setItem('current-date', currentDate);
// //         }
// //     }, [navigate, currentDate]);

// //     const togglePlayPause = useCallback(() => {
// //         if (currentPinIndex === pinPoints.length - 1) {
// //             // 마지막 핀포인트에서 처음으로 돌아가기
// //             setCurrentPinIndex(0);
// //             setCharacterPosition({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
// //             if (mapRef.current) {
// //                 mapRef.current.panTo({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
// //             }
// //             setShowPhotoCard(true);
// //             setIsPlaying(true);
// //             setIsMoving(false);
// //             setIsAtPin(true);
// //         } else {
// //             setIsPlaying(!isPlaying);
// //             if (!isPlaying) {
// //                 // 재생 버튼을 눌렀을 때 즉시 이동 시작
// //                 if (autoPlayTimeoutRef.current) {
// //                     clearTimeout(autoPlayTimeoutRef.current);
// //                 }
// //                 moveCharacter();
// //             }
// //         }
// //     }, [currentPinIndex, pinPoints, isPlaying, moveCharacter]);

// //     const { isLoaded, loadError } = useLoadScript({
// //         googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
// //     });

// //     const characterIcon = useMemo(() => {
// //         if (isLoaded) {
// //             return {
// //                 url: '/src/assets/images/ogami_1.png',
// //                 scaledSize: new window.google.maps.Size(50, 65),
// //                 anchor: new window.google.maps.Point(25, 65),
// //             };
// //         }
// //         return null;
// //     }, [isLoaded]);

// //     const markerIcon = useMemo(() => {
// //         if (isLoaded) {
// //             return {
// //                 path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
// //                 fillColor: '#0073bb',
// //                 fillOpacity: 1,
// //                 strokeWeight: 0,
// //                 rotation: 0,
// //                 scale: 2,
// //                 anchor: new google.maps.Point(12, 23),
// //             };
// //         }
// //         return null;
// //     }, [isLoaded]);

// //     const mapOptions: google.maps.MapOptions = {
// //         mapTypeControl: false,
// //         fullscreenControl: false,
// //         zoomControl: false,
// //         streetViewControl: false,
// //         rotateControl: false,
// //         clickableIcons: false,
// //         minZoom: 12,
// //     };

// //     if (loadError) {
// //         return <div>Error loading maps</div>;
// //     }

// //     if (!isLoaded) {
// //         return <div>Loading maps</div>;
// //     }

// //     return (
// //         <PageContainer isTransitioning={isTransitioning}>
// //             <Header title={tripInfo?.tripTitle || ''} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />
// //             <MapWrapper>
// //                 {isLoading ? (
// //                     <LoadingWrapper>
// //                         <Loading />
// //                     </LoadingWrapper>
// //                 ) : (
// //                     <GoogleMap
// //                         mapContainerStyle={mapContainerStyle}
// //                         center={characterPosition || undefined}
// //                         zoom={INITIAL_ZOOM_LEVEL}
// //                         options={mapOptions}
// //                         onLoad={(map) => {
// //                             mapRef.current = map;
// //                         }}
// //                     >
// //                         {pinPoints.map((point) => (
// //                             <Marker
// //                                 key={point.pinPointId}
// //                                 position={{ lat: point.latitude, lng: point.longitude }}
// //                                 icon={markerIcon || undefined}
// //                             />
// //                         ))}
// //                         {characterPosition && (
// //                             <Marker position={characterPosition} icon={characterIcon || undefined} zIndex={1000} />
// //                         )}
// //                         {isAtPin && (
// //                             <ControlButton onClick={togglePlayPause}>{isPlaying ? <Pause /> : <Play />}</ControlButton>
// //                         )}
// //                         {showPhotoCard && photoCardPosition && currentPinIndex < pinPoints.length && (
// //                             <OverlayView
// //                                 position={photoCardPosition}
// //                                 mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
// //                                 getPixelPositionOffset={(width, height) => ({
// //                                     x: -(PHOTO_CARD_WIDTH / 2),
// //                                     y: -(PHOTO_CARD_HEIGHT + 65 + 40), // 65는 characterIcon의 높이, 40은 추가 간격
// //                                 })}
// //                             >
// //                                 <div
// //                                     css={photoCardStyle}
// //                                     onClick={() =>
// //                                         navigate(`/music-video/${tripId}/${pinPoints[currentPinIndex].pinPointId}`)
// //                                     }
// //                                 >
// //                                     <p>{formatDateToKorean(pinPoints[currentPinIndex].recordDate)}</p>
// //                                     <img css={imageStyle} src={pinPoints[currentPinIndex].mediaLink} alt='photo-card' />
// //                                 </div>
// //                             </OverlayView>
// //                         )}
// //                         {isAtPin && (
// //                             <DaySection onClick={handleDayClick}>
// //                                 <div css={dayInfoTextStyle}>
// //                                     <h2>{currentDay}</h2>
// //                                     <p>{currentDate && formatDateToKorean(currentDate)}</p>
// //                                 </div>
// //                                 <ChevronUp size={20} />
// //                             </DaySection>
// //                         )}
// //                     </GoogleMap>
// //                 )}
// //             </MapWrapper>
// //         </PageContainer>
// //     );
// // };
// // const DaySection = styled.div`
// //     position: absolute;
// //     bottom: 0;
// //     left: 0;
// //     right: 0;
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     padding: 0 20px;
// //     cursor: pointer;
// //     box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
// //     z-index: 1000;
// //     height: ${theme.heights.xtall_60};
// //     background-color: ${theme.colors.white};
// // `;

// // const dayInfoTextStyle = css`
// //     display: flex;
// //     flex-direction: column;
// //     gap: 8px;

// //     h2 {
// //         font-size: 20px;
// //         font-weight: 600;
// //         margin: 0;
// //     }

// //     p {
// //         font-size: 14px;
// //         color: ${theme.colors.darkGray};
// //         margin: 0;
// //     }
// // `;

// // const MapWrapper = styled.div`
// //     flex-grow: 1;
// //     position: relative;
// //     z-index: 0;
// //     min-height: 400px;
// // `;

// // const ControlButton = styled.button`
// //     position: absolute;
// //     bottom: 74px;
// //     right: 10px;
// //     background-color: white;
// //     background-color: ${theme.colors.primary};
// //     color: ${theme.colors.white};
// //     border: none;
// //     border-radius: 50%;
// //     width: 40px;
// //     height: 40px;
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //     cursor: pointer;
// //     box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
// //     z-index: 1000;
// //     transition: all 0.3s ease;

// //     &:hover {
// //         background-color: ${theme.colors.white};
// //         color: ${theme.colors.primary};
// //     }
// // `;

// // const PageContainer = styled.div<{ isTransitioning: boolean }>`
// //     height: 100vh;
// //     display: flex;
// //     flex-direction: column;
// //     transition: transform 0.3s ease-in-out;
// //     transform: ${(props) => (props.isTransitioning ? 'translateY(-100%)' : 'translateY(0)')};
// // `;

// // const LoadingWrapper = styled.div`
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //     height: calc(100vh - 54px);
// // `;

// // const mapContainerStyle = {
// //     height: '100%',
// //     width: '100%',
// // };

// // const photoCardStyle = css`
// //     background-color: ${theme.colors.white};
// //     border: 1px solid #ccc;
// //     border-radius: 4px;
// //     width: 150px;
// //     height: auto;
// //     padding: 2px;
// //     display: flex;
// //     flex-direction: column;
// //     align-items: center;
// //     justify-content: center;
// //     box-shadow:
// //         rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
// //         rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
// //     cursor: pointer;
// //     transition: transform 0.2s ease;
// //     position: relative;

// //     p {
// //         font-size: 18px;
// //         color: #333;
// //         /* color: ${theme.colors.primary}; */
// //         font-weight: 600;
// //         align-self: start;
// //         padding: 4px;
// //     }

// //     &:hover {
// //         transform: scale(1.05);
// //     }

// //     &::after {
// //         content: '';
// //         position: absolute;
// //         bottom: -10px;
// //         left: 50%;
// //         transform: translateX(-50%);
// //         width: 0;
// //         border: 1px solid #ccc;
// //         height: 0;
// //         border-left: 10px solid transparent;
// //         border-right: 10px solid transparent;
// //         border-top: 10px solid white;
// //         box-shadow:
// //             rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
// //             rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
// //     }
// // `;

// // const imageStyle = css`
// //     width: 100%;
// //     aspect-ratio: 1;
// //     object-fit: cover;
// //     border-radius: 4px;
// // `;

// // export default TimelineMap;
