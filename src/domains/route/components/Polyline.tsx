import { Polyline as GoogleMapsPolyline } from '@react-google-maps/api';

import { PinPoint } from '@/domains/route/types';
import { POLYLINE_OPTIONS } from '@/shared/constants/maps/styles';

const Polyline = ({ pinPoints }: { pinPoints: PinPoint[] }) => {
    if (pinPoints.length < 2) return null;
    const path = pinPoints.map((pinPoint) => ({ lat: pinPoint.latitude, lng: pinPoint.longitude }));

    return <GoogleMapsPolyline path={path} options={POLYLINE_OPTIONS} />;
};

export default Polyline;
