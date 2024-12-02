import '@emotion/react';
import { Theme } from '@/styles/theme/theme';

declare module '@emotion/react' {
    // export interface Theme {
    //     colors: ColorsTypes;
    //     fontSizes: FontSizeTypes;
    //     heights: HeightsTypes;
    // }
    export interface Theme extends Theme {}
}
