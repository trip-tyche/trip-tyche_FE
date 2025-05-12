import { useState } from 'react';

import { css } from '@emotion/react';

import Spinner from '@/shared/components/common/Spinner';
import Map from '@/shared/components/Map';
import Marker from '@/shared/components/map/Marker';
import { ZOOM_SCALE } from '@/shared/constants/maps/config';
import { LatLng } from '@/shared/types/map';

interface DateMapProps {
    imageLocation: LatLng;
}

const DateMap = ({ imageLocation }: DateMapProps) => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    return (
        <div css={mapWrapper}>
            {!isMapLoaded && <Spinner />}

            <Map
                zoom={ZOOM_SCALE.DEFAULT.ROUTE}
                center={{ latitude: imageLocation.lat, longitude: imageLocation.lng }}
                onLoad={() => setIsMapLoaded(true)}
            >
                <Marker
                    position={{ latitude: imageLocation.lat, longitude: imageLocation.lng }}
                    isMapLoaded={isMapLoaded}
                />
            </Map>
        </div>
    );
};

const mapWrapper = css`
    height: 180px;
    overflow: hidden;
`;

export default DateMap;
