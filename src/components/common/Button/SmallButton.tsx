import { css } from '@emotion/react';

interface SmallButtonProps {
  text: string;
  theme: 'pri' | 'sec';
}

const SmallButton = ({ text, theme }: SmallButtonProps): JSX.Element => {
  return <button css={SmallButtonStyle(theme)}>{text}</button>;
};

export default SmallButton;

const SmallButtonStyle = (theme: 'pri' | 'sec') => css`
  padding: 8px 16px;
  border-radius: 10px;
  border: 2px solid #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 120px;
  height: 40px;
  transition: background-color 0.3s ease;

  color: ${theme === 'pri' ? '#333' : '#fff'};
  background-color: ${theme === 'pri' ? '#fff' : '#333'};

  &:hover {
    color: ${theme === 'pri' ? '#fff' : '#333'};
    background-color: ${theme === 'pri' ? '#333' : '#fff'};
  }

  &:active {
    opacity: 0.8;
  }
`;
