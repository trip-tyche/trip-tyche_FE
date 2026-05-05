import { keyframes } from '@emotion/react';

export const slamEntry = keyframes`
    0%, 50% {
        transform: translateY(-160%) scale(2.6) rotate(-28deg);
        opacity: 0;
    }
    62% {
        transform: translateY(0) scale(1.12) rotate(-12deg);
        opacity: 1;
    }
    74% {
        transform: translateY(0) scale(0.94) rotate(-12deg);
    }
    100% {
        transform: translateY(0) scale(1) rotate(-12deg);
    }
`;

export const ink = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    30% {
        transform: scale(1);
        opacity: 0.7;
    }
    100% {
        transform: scale(1.6) translate(var(--dx), var(--dy));
        opacity: 0;
    }
`;

export const fadeUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(8px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;
