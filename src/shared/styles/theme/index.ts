import { COLORS, FONT_SIZES, SPACING } from '@/shared/constants/style';
import { Theme } from '@/shared/styles/theme/type';

const theme: Theme = {
    COLORS,
    FONT_SIZES,
    SPACING,
} as const;

export default theme;
