import { css } from '@emotion/react';
import SmallButton from './SmallButton';
import LargeButton from './LargeButton';

interface ButtonProps {
  confirmText: string;
  cancelText: string;
  size: 'lg' | 'sm';
}

const Button = ({ confirmText, cancelText, size }: ButtonProps): JSX.Element => {
  return (
    <>
      {size === 'lg' ? (
        <div css={ButtonContainer(size)}>
          <LargeButton text={confirmText} theme='pri' />
          <LargeButton text={cancelText} theme='sec' />
        </div>
      ) : (
        <div css={ButtonContainer(size)}>
          {' '}
          <SmallButton text={confirmText} theme='pri' />
          <SmallButton text={cancelText} theme='sec' />
        </div>
      )}
    </>
  );
};

export default Button;

const ButtonContainer = (size: 'lg' | 'sm') => css`
  display: flex;
  flex-direction: ${size === 'lg' ? 'column' : 'row'};
  gap: 8px;
`;
