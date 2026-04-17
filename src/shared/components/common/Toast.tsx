import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';

const TOAST_VISIBLE_DURATION = 1200;
const TOAST_FADE_DURATION = 200;

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
    min-height: 52px;
    position: fixed;
    bottom: 84px;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 20px;
    border-radius: 12px;
    background-color: rgba(29, 29, 31, 0.92);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    color: #ffffff;
    font-size: 14px;
    letter-spacing: -0.224px;
    line-height: 1.43;
    z-index: 1000;
    transition: all 0.2s ease-in;
    box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;
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
