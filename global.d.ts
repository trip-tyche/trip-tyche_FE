/// <reference types="vite/client" />


import '@emotion/react';

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: import('@emotion/react').SerializedStyles;
        }
    }

    interface HTMLElementTagNameMap {}

    interface SVGElementTagNameMap {}

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