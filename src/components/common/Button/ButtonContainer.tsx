import { css } from '@emotion/react';
import Button from './Button';

interface ButtonContainerProps {
    confirmText: string;
    cancelText: string;
    size: 'lg' | 'sm';
}

const ButtonContainer = ({ confirmText, cancelText, size }: ButtonContainerProps): JSX.Element => {
    return (
        <div css={ButtonContainerStyle(size)}>
            <Button text={confirmText} theme='pri' size={size === 'lg' ? 'lg' : 'sm'} />
            <Button text={cancelText} theme='sec' size={size === 'lg' ? 'lg' : 'sm'} />
        </div>
    );
};

export default ButtonContainer;

const ButtonContainerStyle = (size: 'lg' | 'sm') => css`
    display: flex;
    flex-direction: ${size === 'lg' ? 'column' : 'row'};
    gap: 8px;
`;
