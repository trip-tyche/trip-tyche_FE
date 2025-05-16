import { useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import BackButton from '@/shared/components/common/Button/BackButton';
import Spinner from '@/shared/components/common/Spinner/Indicator';
import Map from '@/shared/components/map/Map';
import Marker from '@/shared/components/map/Marker';
import { ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/route';
import { Location } from '@/shared/types/map';

interface DateMapProps {
    imageLocation: Location;
}

const DateMap = ({ imageLocation }: DateMapProps) => {
    const [isMapRendered, setIsMapLoaded] = useState(false);

    const { tripKey } = useParams();
    const navigate = useNavigate();

    return (
        <div css={container}>
            {!isMapRendered && <Spinner />}

            <BackButton onClick={() => navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey as string)}`)} />
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

const container = css`
    height: 180px;
    overflow: hidden;
`;

export default DateMap;
