import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GoogleMap, Marker, LoadScript, Polyline } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchTripMapData } from '@/api/trip';
import Loading from '@/components/common/Loading';
import Header from '@/components/layout/Header';
import { ENV } from '@/constants/auth';
import { PATH } from '@/constants/path';
import theme from '@/styles/theme';
import { PinPoint } from '@/types/trip';

const MOVE_DURATION = 2000;
const WAIT_DURATION = 2000;

const TimelineMap = () => {
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
    const characterPositionRef = useRef<google.maps.LatLngLiteral | null>(null);
    const currentPinIndexRef = useRef(0);
    const [showPhotoCard, setShowPhotoCard] = useState(false);
    const animationRef = useRef<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);
    const mapRef = useRef<google.maps.Map | null>(null);

    const [, forceUpdate] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state;

    useEffect(() => {
        const getTripMapData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTripMapData(trip.tripId);
                const sortedDataByDate = data.pinPoints.sort(
                    (a: PinPoint, b: PinPoint) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
                );
                if (isMounted.current) {
                    setPinPoints(sortedDataByDate);
                    console.log('Fetched pinPoints:', sortedDataByDate);
                }
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        };

        getTripMapData();

        return () => {
            isMounted.current = false;
        };
    }, [trip.tripId]);

    const characterIcon = useMemo(() => {
        if (mapsApiLoaded) {
            return {
                url: '/src/assets/images/ogami_1.png',
                scaledSize: new window.google.maps.Size(50, 66.5),
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
                anchor: new window.google.maps.Point(12, 22),
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
    const moveCharacter = useCallback(() => {
        if (!isMounted.current || pinPoints.length === 0) return;

        const currentIndex = currentPinIndexRef.current;
        console.log('moveCharacter called. Current index:', currentIndex);
        const nextPinIndex = currentIndex + 1;

        if (nextPinIndex >= pinPoints.length) {
            console.log('마지막 핀포인트에 도달. 종료.');
            return;
        }

        const start = pinPoints[currentIndex];
        const end = pinPoints[nextPinIndex];
        console.log(`Moving from pin ${currentIndex} to ${nextPinIndex}`);

        const startTime = performance.now();
        setShowPhotoCard(false);

        const animate = (currentTime: number) => {
            if (!isMounted.current) return;

            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / MOVE_DURATION, 1);

            const lat = start.latitude + (end.latitude - start.latitude) * progress;
            const lng = start.longitude + (end.longitude - start.longitude) * progress;

            characterPositionRef.current = { lat, lng };

            // 지도 중심 업데이트
            if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
            }

            forceUpdate({});

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                console.log(`Arrived at pin ${nextPinIndex}`);
                currentPinIndexRef.current = nextPinIndex;
                setShowPhotoCard(true);

                if (nextPinIndex < pinPoints.length - 1) {
                    console.log(`Scheduling next move to pin ${nextPinIndex + 1}`);
                    timeoutRef.current = setTimeout(() => {
                        if (isMounted.current) {
                            moveCharacter();
                        }
                    }, WAIT_DURATION);
                } else {
                    console.log('Reached the last pin. Animation complete.');
                }
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [pinPoints]);

    useEffect(() => {
        if (pinPoints.length > 0 && mapsApiLoaded && currentPinIndexRef.current === 0) {
            console.log('Starting animation sequence');
            characterPositionRef.current = { lat: pinPoints[0].latitude, lng: pinPoints[0].longitude };

            // 초기 위치로 지도 중심 설정
            if (mapRef.current) {
                mapRef.current.panTo(characterPositionRef.current);
            }

            setShowPhotoCard(true);
            forceUpdate({});

            timeoutRef.current = setTimeout(() => {
                if (isMounted.current) {
                    moveCharacter();
                }
            }, WAIT_DURATION);
        }

        return () => {
            console.log('Cleaning up animations and timeouts');
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [pinPoints, mapsApiLoaded, moveCharacter]);

    const onMapLoad = React.useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const center = useMemo(
        () => (pinPoints.length > 0 ? { lat: pinPoints[0].latitude, lng: pinPoints[0].longitude } : { lat: 0, lng: 0 }),
        [pinPoints],
    );

    return (
        <PageContainer>
            <Header title={`${trip.tripTitle}`} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />

            <MapWrapper>
                {isLoading ? (
                    <LoadingWrapper>
                        <Loading />
                    </LoadingWrapper>
                ) : (
                    <LoadScript
                        googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''}
                        onLoad={() => {
                            console.log('Google Maps API loaded');
                            setMapsApiLoaded(true);
                        }}
                    >
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={characterPositionRef.current || undefined}
                            zoom={14}
                            options={mapOptions}
                            onLoad={onMapLoad}
                        >
                            <Polyline
                                path={pinPoints.map((point) => ({ lat: point.latitude, lng: point.longitude }))}
                                options={{
                                    strokeColor: '#17012E',
                                    strokeOpacity: 1,
                                    strokeWeight: 4,
                                }}
                            />
                            {pinPoints.map((point, index) => (
                                <Marker
                                    key={point.pinPointId}
                                    position={{ lat: point.latitude, lng: point.longitude }}
                                    icon={svgMarker || undefined}
                                    label={(index + 1).toString()}
                                />
                            ))}
                            {characterPositionRef.current && (
                                <Marker
                                    position={characterPositionRef.current}
                                    icon={characterIcon || undefined}
                                    zIndex={1000}
                                />
                            )}
                            {showPhotoCard && currentPinIndexRef.current < pinPoints.length && (
                                <div css={divStyle}>
                                    <img
                                        css={imageStyle}
                                        src={pinPoints[currentPinIndexRef.current].mediaLink}
                                        alt='photo-card'
                                    />
                                </div>
                            )}
                        </GoogleMap>
                    </LoadScript>
                )}
            </MapWrapper>
        </PageContainer>
    );
};

const PageContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MapWrapper = styled.div`
    flex-grow: 1;
    position: relative;
    z-index: 0;
    min-height: 400px;
`;

const LoadingWrapper = styled.div`
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const mapContainerStyle = {
    height: '100%',
    width: '100%',
};

const divStyle = css`
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: white;
    border-radius: 8px;
    width: 35%;
    object-fit: cover;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const pStyle = css`
    font-size: ${theme.fontSizes.normal_14};
    font-weight: 600;
    margin-bottom: 8px;
`;

const imageStyle = css`
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
    aspect-ratio: 1;
`;

export default TimelineMap;
