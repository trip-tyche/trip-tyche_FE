import { MAP } from '@/shared/constants/ui';

export const getPixelPositionOffset = (height: number) => {
    const offset = {
        x: -MAP.PHOTO_CARD_SIZE.WIDTH / 2,
        y: -(MAP.PHOTO_CARD_SIZE.HEIGHT + height),
    };
    return offset;
};
