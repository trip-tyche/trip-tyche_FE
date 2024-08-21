import '@emotion/react';

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: import('@emotion/react').SerializedStyles;
        }
    }
}

declare module '@emotion/react' {
    export interface Theme {}
}

export {};
