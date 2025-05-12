import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG } from '@/shared/constants/map';

export const useGoogleMaps = () => {
    const { isLoaded, loadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    return { isLoaded, loadError };
};
