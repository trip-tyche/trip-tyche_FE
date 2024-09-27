import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

const TimelineMap = () => {
    const [pinPoints, setPinPoints] = useState<PinPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState<PinPoint | null>(null);
    const [mapsApiLoaded, setMapsApiLoaded] = useState(false);

    const [characterPosition, setCharacterPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [currentPinIndex, setCurrentPinIndex] = useState(0);
    const animationRef = useRef<number | null>(null);
    // const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

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
                // console.log(sortedData);
                console.log('Fetched data:', data);
                setPinPoints(sortedDataByDate);
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getTripMapData();
    }, [trip.tripId]);

    const characterIcon = useMemo(() => {
        if (mapsApiLoaded) {
            return {
                url: '/src/assets/images/ogami_1.png',
                scaledSize: new window.google.maps.Size(50, 66.5) || undefined, //1.33, 1.4
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

    const center = useMemo(() => {
        if (selectedPoint) {
            return { lat: selectedPoint.latitude, lng: selectedPoint.longitude };
        }
        return { lat: pinPoints[0]?.latitude, lng: pinPoints[0]?.longitude };
    }, [selectedPoint, pinPoints]);

    const mapOptions: google.maps.MapOptions = {
        mapTypeControl: false, // 지도 타입 컨트롤 (지도, 위성 등) 숨기기
        fullscreenControl: false, // 전체화면 컨트롤 숨기기
        zoomControl: false, // 줌 컨트롤 (+, -) 숨기기
        streetViewControl: false, // 거리뷰 (페그맨) 컨트롤 숨기기
        rotateControl: false, // 나침반 숨기기 (지도 회전 시 나타나는 나침반)
        clickableIcons: false,

        // maxZoom: 12, // 최대 줌 레벨
        minZoom: 12, // 최소 줌 레벨
    };

    const MOVE_DURATION = 2000;
    const WAIT_DURATION = 2000;

    const moveCharacter = useCallback(() => {
        if (currentPinIndex >= pinPoints.length - 1) {
            console.log('마지막 핀포인트에 도달');
            return;
        }

        const start = pinPoints[currentPinIndex];
        const end = pinPoints[currentPinIndex + 1];
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / MOVE_DURATION, 1);

            const lat = start.latitude + (end.latitude - start.latitude) * progress;
            const lng = start.longitude + (end.longitude - start.longitude) * progress;

            setCharacterPosition({ lat, lng });

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                console.log('다음 핀 도착');
                setTimeout(() => {
                    setCurrentPinIndex((prev) => prev + 1);
                }, WAIT_DURATION);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [currentPinIndex, pinPoints]);

    useEffect(() => {
        if (pinPoints.length > 0 && mapsApiLoaded) {
            console.log('애니메이션 시작');
            setCharacterPosition({ lat: pinPoints[0].latitude, lng: pinPoints[0].longitude });
            setCurrentPinIndex(0);
        }
    }, [pinPoints, mapsApiLoaded]);

    useEffect(() => {
        if (currentPinIndex < pinPoints.length - 1) {
            console.log(`${currentPinIndex}번 핀에서 ${currentPinIndex + 1}번 핀으로 이동`);
            moveCharacter();
        } else if (currentPinIndex === pinPoints.length - 1) {
            console.log('마지막 핀에 도달, 애니메이션 종료');
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [currentPinIndex, moveCharacter, pinPoints.length]);

    return (
        <PageContainer>
            <Header title={`${trip.tripTitle}`} isBackButton onBack={() => navigate(PATH.TRIP_LIST)} />

            <MapWrapper>
                <LoadScript
                    googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''}
                    onLoad={() => setMapsApiLoaded(true)}
                    loadingElement={
                        <LoadingWrapper>
                            <Loading />
                        </LoadingWrapper>
                    }
                >
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={14}
                        options={mapOptions}
                        // onLoad={(map: google.maps.Map) => {
                        //     setMapRef(map);
                        // }}
                    >
                        <Polyline
                            path={pinPoints.map((point) => ({ lat: point.latitude, lng: point.longitude }))}
                            options={{
                                strokeColor: '#17012E',
                                strokeOpacity: 1,
                                strokeWeight: 4,
                            }}
                        />
                        {pinPoints.map((point) => (
                            <Marker
                                key={point.pinPointId}
                                position={{ lat: point.latitude, lng: point.longitude }}
                                onClick={() => setSelectedPoint(point)}
                                animation={mapsApiLoaded ? window.google.maps.Animation.DROP : undefined}
                                icon={svgMarker || undefined}
                            />
                        ))}
                        {characterPosition && (
                            <Marker
                                position={characterPosition}
                                icon={characterIcon || undefined}
                                zIndex={1000} // 캐릭터를 다른 마커 위에 표시
                            />
                        )}
                        {selectedPoint && (
                            <div css={divStyle}>
                                <p css={pStyle}>사그라다 파밀리아</p>
                                {/* <p css={pStyle}>{selectedPoint.recordDate}</p> */}
                                <img css={imageStyle} src={selectedPoint.mediaLink} alt='photo-card' />
                            </div>
                        )}
                    </GoogleMap>
                </LoadScript>
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
