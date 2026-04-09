import { COLORS, FONT_SIZES, SPACING } from '@/shared/constants/style';

type ColorsTypes = typeof COLORS;
type FontSizeTypes = typeof FONT_SIZES;
type SpacingTypes = typeof SPACING;

export interface Theme {
    COLORS: ColorsTypes;
    FONT_SIZES: FontSizeTypes;
    SPACING: SpacingTypes;
}
