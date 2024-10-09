import '@emotion/react';

declare module '@/*';

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

    // Google Maps 관련 타입 오류 해결을 위한 추가
    interface HTMLElement extends Element {}
    interface HTMLElementTagNameMap {}
    interface SVGElementTagNameMap {}
    interface Element {}
    interface Node {}
    interface WebSocket {}
    interface Worker {}
}

declare module '@emotion/react' {
    export interface Theme {}
}

export {};
