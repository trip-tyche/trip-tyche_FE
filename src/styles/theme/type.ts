import { COLORS, FONT_SIZES } from '@/constants/theme';

type ColorsTypes = typeof COLORS;
type FontSizeTypes = typeof FONT_SIZES;

export interface Theme {
    COLORS: ColorsTypes;
    FONT_SIZES: FontSizeTypes;
}
