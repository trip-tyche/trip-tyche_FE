import React from 'react';

import { OverlayView } from '@react-google-maps/api';
import { MapPinMinus } from 'lucide-react';

interface CustomMarkerProps {
    position: google.maps.LatLngLiteral;
    color?: string;
    size?: number;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ position, color = 'red', size = 24 }) => (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}>
            <MapPinMinus color={color} size={size} />
        </div>
    </OverlayView>
);

export default CustomMarker;
