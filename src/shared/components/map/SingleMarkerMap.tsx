import { useState } from 'react';

import { css } from '@emotion/react';

import Indicator from '@/shared/components/common/Spinner/Indicator';
import Map from '@/shared/components/map/Map';
import Marker from '@/shared/components/map/Marker';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { Location } from '@/shared/types/map';

interface SingleMarkerMapProps {
    position: Location | null;
}

const SingleMarkerMap = ({ position }: SingleMarkerMapProps) => {
    const [isMapRendered, setIsMapLoaded] = useState(false);

    const zoom = position ? ZOOM_SCALE.DEFAULT.ROUTE : ZOOM_SCALE.DEFAULT.NO_DATE;
    const center = position ? { latitude: position.latitude, longitude: position.longitude } : DEFAULT_CENTER;

    return (
        <div css={container}>
            {!isMapRendered && <Indicator />}

            <Map zoom={zoom} center={center} onLoad={() => setIsMapLoaded(true)}>
                {position && <Marker position={center} isMapRendered={isMapRendered} />}
            </Map>
        </div>
    );
};

const container = css`
    height: 180px;
    overflow: hidden;
`;

export default SingleMarkerMap;
