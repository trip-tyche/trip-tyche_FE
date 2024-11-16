import { useEffect, useState } from 'react';

export const useTicket3DEffect = () => {
    const [transform, setTransform] = useState({ x: 0, y: 0 });
    const [isTouching, setIsTouching] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const handleMove = (x: number, y: number, element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const relativeX = x - rect.left;
        const relativeY = y - rect.top;

        const rotateX = ((relativeY - centerY) / centerY) * -20;
        const rotateY = ((relativeX - centerX) / centerX) * 20;

        setTransform({ x: rotateX, y: rotateY });
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isTouching) {
            setIsInteracting(true);
            handleMove(event.clientX, event.clientY, event.currentTarget);
        }
    };

    const handleMouseLeave = () => {
        if (!isTouching) {
            setIsInteracting(false);
            setTransform({ x: 0, y: 0 });
        }
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        setIsTouching(true);
        setIsInteracting(true);

        const touch = event.touches[0];
        handleMove(touch.clientX, touch.clientY, event.currentTarget);
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsInteracting(true);
        const touch = event.touches[0];
        handleMove(touch.clientX, touch.clientY, event.currentTarget);
    };

    const handleTouchEnd = () => {
        setIsTouching(false);
        setIsInteracting(false);
        setTransform({ x: 0, y: 0 });
    };

    useEffect(
        () => () => {
            setIsTouching(false);
            setIsInteracting(false);
            setTransform({ x: 0, y: 0 });
        },
        [],
    );

    const ticketStyle = {
        transform: `perspective(1000px) rotateX(${transform.x}deg) rotateY(${transform.y}deg)`,
        transition: isInteracting ? 'none' : 'transform 0.5s ease',
    };

    return {
        ticketStyle,
        handlers: {
            handleMouseMove,
            handleMouseLeave,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
        },
    };
};
