import '@emotion/react';

declare module '@emotion/react' {
    export interface Theme {}
}

declare module 'react' {
    interface DOMAttributes<T> {
        css?: import('@emotion/react').SerializedStyles;
    }
}
