import { TIMELINE_MAP } from '@/shared/constants/maps/config';

export const getPixelPositionOffset = (height: number) => {
    const offset = {
        x: -TIMELINE_MAP.PHOTO_CARD.WIDTH / 2,
        y: -(TIMELINE_MAP.PHOTO_CARD.HEIGHT + height),
    };
    return offset;
};
