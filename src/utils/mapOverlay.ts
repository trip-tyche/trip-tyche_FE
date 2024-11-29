import { TIMELINE_MAP } from '@/constants/googleMaps';

export const calculatePhotoCardOffset = (height: number) => ({
    x: -TIMELINE_MAP.PHOTO_CARD.WIDTH / 2,
    y: -(TIMELINE_MAP.PHOTO_CARD.HEIGHT + height),
});
