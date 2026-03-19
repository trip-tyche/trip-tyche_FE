import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useShallow } from 'zustand/react/shallow';

import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';

const TOAST_VISIBLE_DURATION = 1200;
const TOAST_FADE_DURATION = 200;

const Toast: React.FC = () => {
    const { isVisible, message, hideToast } = useToastStore(
        useShallow((state) => ({
            isVisible: state.isVisible,
            message: state.message,
            hideToast: state.hideToast,
        })),
    );

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
    bottom: 84px;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    border-radius: 8px;
    background-color: ${theme.COLORS.BACKGROUND.TOAST};
    color: ${theme.COLORS.TEXT.WHITE};
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
