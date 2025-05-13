import { RefObject, useMemo } from 'react';

import { Marker, MarkerClusterer } from '@react-google-maps/api';

import { MediaFile } from '@/domains/media/types';
import { ZOOM_SCALE } from '@/shared/constants/map';
import { MapType } from '@/shared/types/map';

interface ClusterMarkerProps {
    mapRef: RefObject<MapType>;
    images: MediaFile[];
}

const ClusterMarker = ({ mapRef, images }: ClusterMarkerProps) => {
    const options = useMemo(
        () => ({
            maxZoom: ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE - 1,
            zoomOnClick: true,
            minimumClusterSize: 1,
            clickZoom: 2,
            onClick: (cluster: any, _markers: any) => {
                if (mapRef.current) {
                    const currentZoom = mapRef.current.getZoom() || 0;
                    const newZoom = Math.min(currentZoom + 3, ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE - 1);
                    mapRef.current.setZoom(newZoom);
                    mapRef.current.panTo(cluster.getCenter());
                }
            },
        }),
        [],
    );

    return (
        <MarkerClusterer options={options}>
            {(clusterer) => (
                <>
                    {images.map((image) => (
                        <Marker
                            key={image.mediaFileId}
                            position={{ lat: image.latitude, lng: image.longitude }}
                            clusterer={clusterer}
                        />
                    ))}
                </>
            )}
        </MarkerClusterer>
    );
};

export default ClusterMarker;
