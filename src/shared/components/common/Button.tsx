import React, { ComponentPropsWithoutRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';

import theme from '@/shared/styles/theme';

type VariantType = 'primary' | 'white';

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
}: ButtonProps) => (
    <button
        css={[buttonStyles.base, buttonStyles.variants(variant), customStyle]}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading ? (
            <p css={loadingStyle}>{loadingText} </p>
        ) : (
            <React.Fragment>
                {icon && <span css={buttonStyles.icon(!!text)}>{icon}</span>}
                {text}
            </React.Fragment>
        )}
    </button>
);

const buttonStyles = {
    base: css`
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
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `,
    variants: (variant: VariantType) => {
        return css`
            background-color: ${variant === 'primary' ? theme.COLORS.PRIMARY : '#f2f4f9'};
            color: ${variant === 'primary' ? '#f2f4f9' : theme.COLORS.PRIMARY};
            @media (hover: hover) {
                &:hover {
                    background-color: ${variant === 'primary' ? theme.COLORS.PRIMARY_HOVER : '#e5e8f0'};
                }
            }
            &:active {
                background-color: ${variant === 'primary' ? theme.COLORS.PRIMARY_HOVER : '#e5e8f0'};
            }
        `;
    },
    icon: (isText: boolean) => css`
        display: flex;
        margin-right: ${isText ? '4px' : '0px'};
        align-items: center;
    `,
};

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: ${theme.FONT_SIZES.LG};
`;

export default Button;
