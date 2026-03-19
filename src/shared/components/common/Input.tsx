import { TextInput, TextInputProps } from '@mantine/core';

import { COLORS } from '@/shared/constants/style';

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
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '&:focus-within': {
                        outline: 'none',
                        border: `2px solid ${COLORS.PRIMARY}`,
                        boxShadow: COLORS.BOX_SHADOW.INPUT_FOCUS,
                    },
                },
            }}
            {...props}
        />
    );
};

export default Input;
