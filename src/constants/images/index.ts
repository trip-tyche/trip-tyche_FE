export const COMPRESSION_OPTIONS = {
    maxWidthOrHeight: 1280,

    initialQuality: 0.7,
    useWebWorker: true,
    preserveExif: true,

    fileType: 'image/webp',
    webpOptions: {
        quality: 0.7,
        lossless: false,
        nearLossless: false,
        alpha_quality: 1,
        method: 4,
    },
} as const;
