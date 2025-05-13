import { Polyline as GoogleMapsPolyline } from '@react-google-maps/api';

import { PinPoint } from '@/domains/route/types';
import { COLORS } from '@/shared/constants/theme';
import { PolylineOption } from '@/shared/types/map';

const Polyline = ({ pinPoints }: { pinPoints: PinPoint[] }) => {
    if (pinPoints.length < 2) return null;

    const path = pinPoints.map((pinPoint) => ({ lat: pinPoint.latitude, lng: pinPoint.longitude }));

    const options: PolylineOption = {
        strokeColor: `${COLORS.PRIMARY}`,
        strokeOpacity: 0.7,
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
