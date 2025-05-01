import { css } from '@emotion/react';

export const scrollbarStyles = css`
    // 브라우저 기본 스크롤 숨기기
    // 스크롤바 각 브라우저마다 보이지 않게 동작
    // Webkit browsers (Chrome, Safari)
    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE and Edge
    // 터치 기기에서의 스크롤 동작 개선, 네이티브와 같이 동작
    -webkit-overflow-scrolling: touch;
`;
