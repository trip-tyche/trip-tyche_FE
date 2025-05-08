import { TextInput, TextInputProps } from '@mantine/core';

import theme from '@/shared/styles/theme';

interface InputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

const Input = ({ value, onChange, ...props }: InputProps) => {
    return (
        <TextInput
            size='md'
            radius='md'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            styles={{
                input: {
                    ...inputBaseStyles,
                },
            }}
            {...props}
        />
    );
};

const inputBaseStyles = {
    '&:focusWithin': {
        outline: 'none',
        border: `2px solid ${theme.COLORS.PRIMARY}`,
    },
};

export default Input;
