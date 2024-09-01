import { css } from '@emotion/react';

import Button from './Button';

export interface ButtonContainerProps {
    confirmText: string;
    cancelText: string;
    size: 'lg' | 'sm';
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
            theme={size === 'lg' ? 'sec' : 'pri'}
            size={size === 'lg' ? 'lg' : 'sm'}
            onClick={confirmModal}
        />
        <Button
            text={size === 'lg' ? `${cancelText}` : `${confirmText}`}
            theme={size === 'lg' ? 'pri' : 'sec'}
            size={size === 'lg' ? 'lg' : 'sm'}
            onClick={closeModal}
        />
    </div>
);

export default ButtonContainer;

const ButtonContainerStyle = (size: 'lg' | 'sm') => css`
    display: flex;
    flex-direction: ${size === 'lg' ? 'column' : 'row'};
    gap: 8px;
`;
