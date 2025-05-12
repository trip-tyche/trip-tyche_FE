import { RefObject, useMemo } from 'react';

import { Marker, MarkerClusterer } from '@react-google-maps/api';

import { MediaFile } from '@/domains/media/types';
import { MARKER_CLUSTER_OPTIONS, MARKER_ICON_CONFIG, ZOOM_SCALE } from '@/shared/constants/map';
import { MapType } from '@/shared/types/map';

interface ClusterMarkerProps {
    mapRef: RefObject<MapType>;
    images: MediaFile[];
}

const ClusterMarker = ({ mapRef, images }: ClusterMarkerProps) => {
    const clusterOptions = useMemo(
        () => ({
            ...MARKER_CLUSTER_OPTIONS,
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
        <MarkerClusterer options={clusterOptions}>
            {(clusterer) => (
                <>
                    {images.map((image) => (
                        <Marker
                            key={image.mediaFileId}
                            position={{ lat: image.latitude, lng: image.longitude }}
                            clusterer={clusterer}
                            icon={{
                                ...MARKER_ICON_CONFIG,
                                anchor: new window.google.maps.Point(12, 23),
                            }}
                        />
                    ))}
                </>
            )}
        </MarkerClusterer>
    );
};

export default ClusterMarker;
