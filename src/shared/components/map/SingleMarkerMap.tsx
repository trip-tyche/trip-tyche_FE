import { RefObject, useState } from 'react';

import { css } from '@emotion/react';

import { hasValidLocation } from '@/libs/utils/validate';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import Map from '@/shared/components/map/Map';
import Marker from '@/shared/components/map/Marker';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { Location, MapType } from '@/shared/types/map';

interface SingleMarkerMapProps {
    mapRef?: RefObject<MapType>;
    position: Location | null;
    onMapClick?: (event?: google.maps.MapMouseEvent) => void;
    mapHeight?: string;
}

const SingleMarkerMap = ({ mapRef, position, onMapClick, mapHeight = '180px' }: SingleMarkerMapProps) => {
    const [isMapRendered, setIsMapLoaded] = useState(false);

    const isValidLocation = position !== null && hasValidLocation(position);
    const zoom = isValidLocation ? ZOOM_SCALE.DEFAULT : ZOOM_SCALE.UNLOCATION;
    const center = isValidLocation ? { latitude: position.latitude, longitude: position.longitude } : DEFAULT_CENTER;

    return (
        <div css={container(mapHeight)}>
            {!isMapRendered && <Indicator />}

            <Map zoom={zoom} center={center} onLoad={() => setIsMapLoaded(true)} onClick={onMapClick}>
                {position && <Marker mapRef={mapRef} position={center} isMapRendered={isMapRendered} />}
            </Map>
        </div>
    );
};

const container = (height: string) => css`
    height: ${height};
    overflow: hidden;
`;

export default SingleMarkerMap;
