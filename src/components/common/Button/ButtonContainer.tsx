import { css } from '@emotion/react';

import Button from './Button';

export interface ButtonContainerProps {
    confirmText: string;
    cancelText: string;
    size: 'full' | 'lg' | 'sm';
    confirmModal?: () => void;
    closeModal?: () => void;
}

const ButtonContainer = ({
    confirmText,
    cancelText,
    size,
    confirmModal,
    closeModal,
}: ButtonContainerProps): JSX.Element => (
    <div css={ButtonContainerStyle(size)}>
        <Button
            text={size === 'lg' ? `${confirmText}` : `${cancelText}`}
            btnTheme={size === 'lg' ? 'sec' : 'pri'}
            size={size === 'lg' ? 'lg' : size === 'full' ? 'full' : 'sm'}
            onClick={confirmModal}
        />
        <Button
            text={size === 'lg' ? `${cancelText}` : `${confirmText}`}
            btnTheme={size === 'lg' ? 'pri' : 'sec'}
            size={size === 'lg' ? 'lg' : size === 'full' ? 'full' : 'sm'}
            onClick={closeModal}
        />
    </div>
);

export default ButtonContainer;

const ButtonContainerStyle = (size: 'full' | 'lg' | 'sm') => css`
    display: flex;

    flex-direction: ${size === 'lg' ? 'column' : 'row'};
    gap: 8px;
`;
