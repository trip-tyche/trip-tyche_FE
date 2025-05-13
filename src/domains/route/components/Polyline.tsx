import { Polyline as GoogleMapsPolyline } from '@react-google-maps/api';

import { PinPoint } from '@/domains/route/types';
import { COLORS } from '@/shared/constants/theme';
import { PolylineOption } from '@/shared/types/map';

const Polyline = ({
    pinPoints,
    isCharacterVisible = true,
}: {
    pinPoints: PinPoint[];
    isCharacterVisible?: boolean;
}) => {
    const SINGLE_PINPOINT = 1;

    if (pinPoints.length === SINGLE_PINPOINT) return null;
    const path = pinPoints.map((pinPoint) => ({ lat: pinPoint.latitude, lng: pinPoint.longitude }));

    const options: PolylineOption = {
        strokeColor: isCharacterVisible ? COLORS.PRIMARY : COLORS.TEXT.DESCRIPTION_LIGHT,
        strokeOpacity: isCharacterVisible ? 0.7 : 0.5,
        strokeWeight: 0,
        icons: [
            {
                icon: {
                    path: 'M 0,-1 0,1',
                    scale: 3,
                },
                repeat: '12px',
            },
        ],
    };

    return <GoogleMapsPolyline path={path} options={options} />;
};

export default Polyline;
