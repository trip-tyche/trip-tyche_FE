import React, { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { TextInput, TextInputProps } from '@mantine/core';

import theme from '@/styles/theme';
import { validateUserNickName } from '@/libs/utils/validate';

type variantType = 'default' | 'error';

interface InputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    variant?: variantType;
    setIsInvalid?: (isValid: boolean) => void;
}

const Input = ({ value, onChange, variant = 'default', setIsInvalid, ...props }: InputProps) => {
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (variant === 'error' && setIsInvalid) {
            if (value.length === 0) {
                setErrorMessage('');
                setIsInvalid(true);
            } else {
                const error = validateUserNickName(value);
                setErrorMessage(error || '');
                setIsInvalid(!!error);
            }
        }
    }, [value, variant, setIsInvalid]);

    return (
        <React.Fragment>
            <TextInput
                size='md'
                radius='md'
                value={value}
                onChange={(event) => onChange(event.target.value)}
                styles={{
                    input: {
                        ...inputBaseStyles,
                        ...(errorMessage ? errorStyle : {}),
                    },
                }}
                {...props}
            />
            {variant === 'error' && <p css={errorMessageStyle}>{errorMessage}</p>}
        </React.Fragment>
    );
};

const inputBaseStyles = {
    '&:focusWithin': {
        outline: 'none',
        border: `2px solid ${theme.COLORS.PRIMARY}`,
    },
};

const errorStyle = {
    borderWidth: '1.2px',
    borderColor: `${theme.COLORS.TEXT.ERROR}`,
};

const errorMessageStyle = css`
    margin-top: 8px;
    margin-left: 4px;
    color: ${theme.COLORS.TEXT.ERROR};
    font-size: ${theme.FONT_SIZES.MD};
`;

export default Input;
