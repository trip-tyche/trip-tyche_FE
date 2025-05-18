import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG } from '@/shared/constants/map';

export const useMapScript = () => {
    const { isLoaded: isMapScriptLoaded, loadError: isMapScriptLoadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    return {
        isMapScriptLoaded,
        isMapScriptLoadError,
    };
};
