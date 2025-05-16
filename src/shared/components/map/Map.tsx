import { css } from '@emotion/react';
import { GoogleMap } from '@react-google-maps/api';

import { MAPS_OPTIONS } from '@/shared/constants/map';
import { Location, MapType } from '@/shared/types/map';

interface MapProps {
    zoom: number;
    center: Location;
    children: React.ReactNode;
    isInteractive?: boolean;
    onLoad: (map: MapType) => void;
    onZoomChanged?: () => void;
    onClick?: () => void;
}

const Map = ({ zoom, center, children, isInteractive = true, onLoad, onZoomChanged, onClick }: MapProps) => {
    const { latitude, longitude } = center;

    return (
        <div css={map}>
            <GoogleMap
                zoom={zoom}
                center={{ lat: latitude, lng: longitude }}
                options={{
                    ...MAPS_OPTIONS,
                    draggable: isInteractive,
                    scrollwheel: isInteractive,
                }}
                mapContainerStyle={{ height: 'calc(100% + 30px)' }}
                onLoad={onLoad}
                onZoomChanged={onZoomChanged}
                onClick={onClick}
            >
                {children}
            </GoogleMap>
        </div>
    );
};

const map = css`
    height: 100%;
`;

export default Map;
