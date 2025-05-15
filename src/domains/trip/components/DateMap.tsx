import { useState } from 'react';

import { css } from '@emotion/react';

import Spinner from '@/shared/components/common/Spinner/Indicator';
import Map from '@/shared/components/map/Map';
import Marker from '@/shared/components/map/Marker';
import { ZOOM_SCALE } from '@/shared/constants/map';
import { Location } from '@/shared/types/map';

interface DateMapProps {
    imageLocation: Location;
}

const DateMap = ({ imageLocation }: DateMapProps) => {
    const [isMapRendered, setIsMapLoaded] = useState(false);

    return (
        <div css={mapWrapper}>
            {!isMapRendered && <Spinner />}

            <Map
                zoom={ZOOM_SCALE.DEFAULT.ROUTE}
                center={{ latitude: imageLocation.latitude, longitude: imageLocation.longitude }}
                onLoad={() => setIsMapLoaded(true)}
            >
                <Marker
                    position={{ latitude: imageLocation.latitude, longitude: imageLocation.longitude }}
                    isMapRendered={isMapRendered}
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
