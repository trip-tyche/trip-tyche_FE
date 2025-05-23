import React, { ComponentPropsWithoutRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';

import { COLORS, THEME_COLORS } from '@/shared/constants/style';
import theme from '@/shared/styles/theme';

type VariantType = 'primary' | 'white' | 'error';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: VariantType;
    text?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    customStyle?: SerializedStyles;
}

const Button = ({
    variant = 'primary',
    text,
    icon,
    isLoading = false,
    loadingText,
    disabled,
    customStyle,
    ...props
}: ButtonProps) => {
    return (
        <button
            css={[baseStyles, buttonStlye[variant](!disabled), customStyle]}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <p css={loadingStyle}>{loadingText} </p>
            ) : (
                <React.Fragment>
                    {icon && <span css={iconStlye(!!text)}>{icon}</span>}
                    {text}
                </React.Fragment>
            )}
        </button>
    );
};

const baseStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    border-radius: 12px;
    width: 100%;
    height: 48px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:active {
        transform: scale(0.97);
    }
`;

const buttonStlye = {
    primary: (isActive: boolean) => css`
        background-color: ${isActive ? COLORS.PRIMARY : COLORS.DISABLED};
        color: ${isActive ? '#f2f4f9' : '#1010104d'};

        @media (hover: hover) {
            &:hover {
                background-color: ${isActive ? COLORS.PRIMARY_HOVER : COLORS.DISABLED};
            }
        }

        &:active {
            background-color: ${COLORS.PRIMARY_HOVER};
        }
        &:disabled {
            cursor: not-allowed;
        }
    `,
    white: (isActive: boolean) => css`
        background-color: ${isActive ? '#f2f4f9' : COLORS.DISABLED};
        color: ${isActive ? COLORS.PRIMARY : '#1010104d'};

        @media (hover: hover) {
            &:hover {
                background-color: ${'#e5e8f0'};
            }
        }

        &:active {
            background-color: ${'#e5e8f0'};
        }
        &:disabled {
            cursor: not-allowed;
        }
    `,
    error: (isActive: boolean) => css`
        background-color: ${isActive ? THEME_COLORS.error.BACKGROUND : COLORS.DISABLED};
        color: ${isActive ? THEME_COLORS.error.TEXT : COLORS.DISABLED};

        &:hover {
            background-color: ${isActive ? '#ffe8e8' : COLORS.DISABLED};
        }
        &:disabled {
            cursor: not-allowed;
        }
    `,
};

const iconStlye = (isText: boolean) => css`
    display: flex;
    margin-right: ${isText ? '4px' : '0px'};
    align-items: center;
`;

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: ${theme.FONT_SIZES.LG};
`;

export default Button;
