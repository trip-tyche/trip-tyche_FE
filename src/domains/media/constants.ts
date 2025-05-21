export const COMPRESSION_OPTIONS = {
    maxWidthOrHeight: 1280,

    initialQuality: 0.8,
    useWebWorker: true,
    preserveExif: true,

    fileType: 'image/webp',
    webpOptions: {
        quality: 0.8,
        lossless: false,
        nearLossless: false,
        alpha_quality: 1,
        method: 4,
    },
} as const;

export const MEDIA_FORMAT = {
    CURRENT_MEDIA_FORMAT: /\.[^/.]+$/,
    WEBP_FORMAT: '.webp',
};

/** 메타데이터 없는 이미지의 경우,
 * (위치) latitude, longitude 0으로 초기화
 * (날짜) '1980-01-01T00:00:00'로 초기화 (''로 전송 시, 에러 발생)
 */
export const DEFAULT_METADATA = {
    LOCATION: 0,
    DATE: '1980-01-01T00:00:00',
};
