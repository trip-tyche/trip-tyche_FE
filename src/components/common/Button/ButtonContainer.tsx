import { css } from '@emotion/react';
import Button, { ButtonProps } from './Button';

interface ButtonContainerProps extends ButtonProps {
    confirmText: string;
    cancelText: string;
    confirmModal?: () => void;
    closeModal?: () => void;
}

const ButtonContainer = ({
    confirmText,
    cancelText,
    size,
    confirmModal,
    closeModal,
}: ButtonContainerProps): JSX.Element => {
    return (
        <div css={ButtonContainerStyle(size)}>
            <Button text={confirmText} theme='pri' size={size === 'lg' ? 'lg' : 'sm'} onClick={confirmModal} />
            <Button text={cancelText} theme='sec' size={size === 'lg' ? 'lg' : 'sm'} onClick={closeModal} />
        </div>
    );
};

export default ButtonContainer;

const ButtonContainerStyle = (size: 'lg' | 'sm') => css`
    display: flex;
    flex-direction: ${size === 'lg' ? 'column' : 'row'};
    gap: 8px;
`;
