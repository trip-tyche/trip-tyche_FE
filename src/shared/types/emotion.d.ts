import '@emotion/react';
import { Theme as CustomTheme } from '@/shared/styles/theme';

declare module '@emotion/react' {
    export interface Theme extends CustomTheme {}
}
