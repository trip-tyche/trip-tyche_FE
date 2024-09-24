import { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import L, { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchTripMapData } from '@/api/trip';
import Header from '@/components/layout/Header';

interface TripMapData {
    pinPointId: number;
    latitude: number;
    longitude: number;
    mediaLink: string;
    recordDate: string;
}

const TimelineMap = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state;
    const [tripMapData, setTripMapData] = useState<TripMapData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getTripMapData = async () => {
            try {
                const data = await fetchTripMapData(trip.tripId);
                console.log('Fetched data:', data.pinPoints);
                setTripMapData(data.pinPoints);
            } catch (error) {
                console.error('Error fetching trip data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getTripMapData();
    }, [trip.tripId]);

    const center: LatLngExpression =
        tripMapData.length > 0 ? [tripMapData[0].latitude, tripMapData[0].longitude] : [37.5665, 126.978]; // 서울의 좌표 또는 다른 기본값

    const customIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <PageContainer>
            <Header title={`${trip.tripTitle}`} isBackButton onBack={() => navigate('/trips')} />
            <MapWrapper>
                <MapContainer center={center} zoom={13} css={mapContainerStyle}>
                    <TileLayer
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ko'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {tripMapData.map((point) => (
                        <Marker
                            key={point.pinPointId}
                            position={[point.latitude, point.longitude] as LatLngExpression}
                            icon={customIcon}
                        >
                            <Popup>
                                <div>
                                    <img css={popupImageStyle} src={point.mediaLink} alt='Trip location' />
                                    <p>{point.recordDate}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
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

const mapContainerStyle = css`
    height: 100%;
    width: 100%;
    position: absolute;
    inset: 0;
`;

const popupImageStyle = css`
    width: 100%;
    max-height: 200px;
    object-fit: cover;
`;

export default TimelineMap;
