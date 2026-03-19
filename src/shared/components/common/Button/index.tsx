import React, { ComponentPropsWithoutRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';

import { COLORS, THEME_COLORS } from '@/shared/constants/style';
import theme from '@/shared/styles/theme';

type VariantType = 'primary' | 'white' | 'error';
type SizeType = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: VariantType;
    size?: SizeType;
    text?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    customStyle?: SerializedStyles;
}

const BUTTON_SIZES = {
    sm: { height: '36px', fontSize: theme.FONT_SIZES.SM, borderRadius: '8px' },
    md: { height: '44px', fontSize: theme.FONT_SIZES.MD, borderRadius: '10px' },
    lg: { height: '48px', fontSize: theme.FONT_SIZES.LG, borderRadius: '12px' },
} as const;

const Button = ({
    variant = 'primary',
    size = 'lg',
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
            css={[baseStyles, sizeStyle(size), buttonStyle[variant](!disabled), customStyle]}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <p css={loadingStyle}>{loadingText} </p>
            ) : (
                <React.Fragment>
                    {icon && <span css={iconStyle(!!text)}>{icon}</span>}
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
    width: 100%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:active {
        transform: scale(0.97);
    }
`;

const sizeStyle = (size: SizeType) => css`
    height: ${BUTTON_SIZES[size].height};
    font-size: ${BUTTON_SIZES[size].fontSize};
    border-radius: ${BUTTON_SIZES[size].borderRadius};
`;

const buttonStyle = {
    primary: (isActive: boolean) => css`
        background-color: ${isActive ? COLORS.PRIMARY : COLORS.DISABLED};
        color: ${isActive ? COLORS.BUTTON.WHITE_BG : COLORS.BUTTON.DISABLED_TEXT};

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
        background-color: ${isActive ? COLORS.BUTTON.WHITE_BG : COLORS.DISABLED};
        color: ${isActive ? COLORS.PRIMARY : COLORS.BUTTON.DISABLED_TEXT};

        @media (hover: hover) {
            &:hover {
                background-color: ${COLORS.BUTTON.WHITE_HOVER};
            }
        }

        &:active {
            background-color: ${COLORS.BUTTON.WHITE_HOVER};
        }
        &:disabled {
            cursor: not-allowed;
        }
    `,
    error: (isActive: boolean) => css`
        background-color: ${isActive ? THEME_COLORS.error.BACKGROUND : COLORS.DISABLED};
        color: ${isActive ? THEME_COLORS.error.TEXT : COLORS.DISABLED};

        &:hover {
            background-color: ${isActive ? COLORS.BUTTON.ERROR_HOVER : COLORS.DISABLED};
        }
        &:disabled {
            cursor: not-allowed;
        }
    `,
};

const iconStyle = (isText: boolean) => css`
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
