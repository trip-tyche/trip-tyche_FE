import React, { ComponentProps } from 'react';

import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

type VariantType = 'primary' | 'white';

interface ButtonProps extends ComponentProps<'button'> {
    variant?: VariantType;
    text?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    css?: SerializedStyles;
}

const Button = ({
    variant = 'primary',
    text,
    icon,
    isLoading = false,
    loadingText,
    disabled,
    ...props
}: ButtonProps) => (
    <button css={[buttonStyles.base, buttonStyles.variants(variant)]} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
            <p css={loadingStyle}>{loadingText} </p>
        ) : (
            <React.Fragment>
                {icon && <span css={buttonStyles.icon}>{icon}</span>}
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
        font-weight: bold;
        border: 0;
        border-radius: 16px;
        width: 100%;
        height: 54px;
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
            background-color: ${variant === 'primary' ? theme.colors.primary : '#f2f4f9'};
            color: ${variant === 'primary' ? '#f2f4f9' : theme.colors.primary};
            @media (hover: hover) {
                &:hover {
                    background-color: ${variant === 'primary' ? theme.colors.primaryHover : '#e5e8f0'};
                }
            }
            &:active {
                background-color: ${variant === 'primary' ? theme.colors.primaryHover : '#e5e8f0'};
            }
        `;
    },
    icon: css`
        display: flex;
        margin-right: 4px;
        align-items: center;
    `,
};

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: ${theme.fontSizes.normal_14};

    p {
        font-size: 14px;
    }
`;

export default Button;
