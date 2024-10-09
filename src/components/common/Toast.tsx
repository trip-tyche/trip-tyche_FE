import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';

const TOAST_VISIBLE_DURATION = 1500; // 토스트가 보이는 시간 (ms)
const TOAST_FADE_DURATION = 200; // 토스트가 사라지는 애니메이션 시간 (ms)

const Toast: React.FC = () => {
    const isVisible = useToastStore((state) => state.isVisible);
    const message = useToastStore((state) => state.message);
    const hideToast = useToastStore((state) => state.hideToast);

    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const hideTimer = setTimeout(() => {
                setIsAnimating(false);
            }, TOAST_VISIBLE_DURATION);
            const removeTimer = setTimeout(() => {
                hideToast();
            }, TOAST_VISIBLE_DURATION + TOAST_FADE_DURATION);
            return () => {
                clearTimeout(hideTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [isVisible, hideToast]);

    if (!isVisible && !isAnimating) {
        return null;
    }

    return <div css={[toastStyle, isAnimating ? toastEnterStyle : toastLeaveStyle]}>{message}</div>;
};
const toastStyle = css`
    width: 90vw;
    max-width: 388px;
    height: 60px;
    position: fixed;
    bottom: 54px;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    border-radius: 8px;
    background-color: #455555;
    color: ${theme.colors.white};
    z-index: 1000;
    transition: all 0.2s ease-in;
`;
const toastEnterStyle = css`
    opacity: 1;
    transform: translateX(-50%) translateY(0);
`;

const toastLeaveStyle = css`
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
`;
export default Toast;
