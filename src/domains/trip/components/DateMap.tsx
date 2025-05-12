import { css } from '@emotion/react';

import Map from '@/shared/components/Map';
import Marker from '@/shared/components/map/Marker';
import { ZOOM_SCALE } from '@/shared/constants/maps/config';
import { LatLng } from '@/shared/types/map';

interface DateMapProps {
    imageLocation: LatLng;
}

const DateMap = ({ imageLocation }: DateMapProps) => {
    return (
        <div css={mapWrapper}>
            <Map zoom={ZOOM_SCALE.DEFAULT.ROUTE} center={{ latitude: imageLocation.lat, longitude: imageLocation.lng }}>
                <Marker position={{ latitude: imageLocation.lat, longitude: imageLocation.lng }} />
            </Map>
        </div>
    );
};

const mapWrapper = css`
    height: 180px;
    overflow: hidden;
`;

export default DateMap;
