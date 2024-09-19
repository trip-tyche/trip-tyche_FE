import '@emotion/react';

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: import('@emotion/react').SerializedStyles;
        }
    }

    interface HTMLElementTagNameMap {
        // HTML 요소들의 태그 이름과 해당 요소 타입을 매핑
        // 예: 'div': HTMLDivElement;
    }

    interface SVGElementTagNameMap {
        // SVG 요소들의 태그 이름과 해당 요소 타입을 매핑
        // 예: 'svg': SVGSVGElement;
    }

    interface DOMRect {
        x: number;
        y: number;
        width: number;
        height: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
    }
}

declare module '@emotion/react' {
    export interface Theme {}
}

export {};

declare module 'leaflet' {
    export * from '@types/leaflet';
}
declare module 'leaflet';
