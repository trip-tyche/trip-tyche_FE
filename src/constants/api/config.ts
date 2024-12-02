export const ENV = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};

export const API_ENDPOINTS = {
    USERS: '/api/user',
    TRIPS: '/api/trips',
} as const;

export const DEFAULT_HEADERS = {
    accept: '*/*',
    'Content-Type': 'application/json',
};
